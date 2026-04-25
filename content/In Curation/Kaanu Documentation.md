
_Operational reference for the running Kaanu platform. What exists, where it lives, how to get to it, and which script does what. Read `KAANU_PHASE_2_PLAN.md` for the plan; read this page when you need to touch the live system._

**Last updated:** 2026-04-25

## 1. What is running right now

A DigitalOcean droplet in Bangalore running Omeka S 4.2 behind nginx, currently reachable at `new.kaanu.org` over HTTPS. Under the current plan this name is being retired and the same Omeka will move to `archive.kaanu.org`, with stable citation URLs at `kaanu.org/bib/<kaanu_id>` proxied across the split. The droplet itself does not change.

|Item|Value|
|---|---|
|Public IP|168.144.66.105|
|Region|BLR1 (Bangalore)|
|Size|s-2vcpu-4gb with 2 GB swap|
|OS|Ubuntu 24.04 LTS|
|Web server|nginx 1.24|
|PHP|8.3-FPM|
|Database|MySQL (local, `omeka` database, `omeka` user)|
|TLS|Let's Encrypt via certbot, auto-renewed by systemd timer|
|Backups|DigitalOcean weekly backups enabled|
|Monitoring|DO monitoring agent enabled|
|SSH|`ssh -i ~/.ssh/id_ed25519 daktre@168.144.66.105` (key-only, root login disabled)|

DNS is currently at GoDaddy (nameservers `ns15.domaincontrol.com` / `ns16.domaincontrol.com`). The apex `kaanu.org` still points to the existing Manifold site and will be cut over as part of Phase 2A in the current plan.

For the fullest version of the deployment history, see `kaanu_deployment_log.md`. That file is the authoritative record of what was actually done on the droplet; this page summarises it.

## 2. Omeka S modules installed

Eight modules from the original plan are active on the running instance. Two more are pending install in Phase 2A; three were never zip-installable and can be cloned from GitHub if needed later.

|Module|State|Purpose|
|---|---|---|
|CSV Import|Active|Bulk import from CSV, including URL-ingested media|
|Value Suggest|Active|Autocomplete from authority vocabularies (VIAF, LCSH, AAT)|
|Collecting|Active|Community submission forms|
|Zotero Import|Active|Direct Zotero API import|
|Common|Active|Dependency for Daniel-KM module family|
|Advanced Resource Template|Active|Custom field types; dependency for Contribute|
|Contribute|Active|Public contribution workflows|
|Selection|Active|User-curated reading lists|
|Mapper|Not installed|Optional authority autofill (IdRef, Geonames)|
|Annotate, Comments, MetadataBrowse|Not installed|No zip release available; install via git clone when needed|
|Clean Url|To install in Phase 2A|Identifier-based URLs (`/bib/<kaanu_id>`)|
|File Sideload|To install in Phase 2A|Bulk PDF ingest from a server-side directory|

## 3. Vocabularies and data model

The Kaanu custom vocabulary is registered in Omeka admin with prefix `kaanu`, namespace `https://kaanu.org/ns/`, and two properties: `identifier` (label: "Kaanu identifier") and `otherDoi` (label: "Other DOI"). The BIBO vocabulary is bundled with Omeka S and provides `bibo:uri` (the full stable URL) and `bibo:doi` (the canonical DOI minted by Zenodo).

Every bibliographic record carries at minimum these properties:

- `kaanu:identifier` is the opaque durable ID, e.g. `kb000001`.
- `bibo:uri` is the full stable URL, e.g. `https://kaanu.org/bib/kb000001`.
- `bibo:doi` is the canonical Kaanu DOI, minted by Zenodo, e.g. `10.5281/zenodo.NNNNNN`.
- `kaanu:otherDoi` is multivalued and holds any pre-existing publisher DOI (CrossRef, DataCite-elsewhere) for cross-reference. Empty for records without a prior DOI.
- Dublin Core core set: `dcterms:title`, `dcterms:creator`, `dcterms:date`, `dcterms:subject`, `dcterms:description`, `dcterms:rights`, `dcterms:source`.
- Community, region, era via Value Suggest with the controlled vocabularies defined per the archivist handbook.

Resource templates enforce required fields per item type. The current templates are Bibliographic Item, Multimedia Item (images, audio, video), and Community Portrait (Exhibit-backed).

## 4. Deployment scripts

All four deployment scripts live under `infra/` and are DNS-provider-agnostic.

|File|Purpose|
|---|---|
|`deploy.sh`|Creates the droplet from your laptop|
|`setup.sh`|Runs on the droplet (called by deploy.sh); installs LEMP, MySQL, Omeka S|
|`certbot.sh`|Runs on the droplet after DNS is pointed; issues the TLS certificate|
|`configure-spaces.sh`|Runs on the droplet when you want to move file storage to DO Spaces|
|`do.env.example`|Template for the DO API token file|
|`README.md`|How to use the scripts|

Three in-flight discoveries during the trial install have been folded into the scripts: the Omeka zip extracts to `omeka-s/` not `omeka-s-<version>/`; `database.ini` has no section header and the username field is called `user`; the nginx deny rule must not block `/application/` (Omeka's own CSS/JS lives there). One fix is not yet in the scripts: `setup.sh` still downloads Omeka S 4.1.1 and the running droplet was upgraded to 4.2.x in place. A future rebuild should update the script first.

## 5. Migration scripts

All live under `migration/scripts/`. Most are specific to one step in the Phase 2 pipeline.

|Script|Purpose|Phase|
|---|---|---|
|`build_quartz_inventory.py`|Parses the legacy Obsidian vault `Publications/` notes, extracts keywords, annotated PDF links, original source links, and duplicate groups. Writes the working ledger CSV plus a summary markdown plus a pilot 10-item CSV.|2B setup|
|`build_pilot_import_packet.py`|Builds the pilot Zotero-to-Omeka import packet from the inventory.|2A pilot|
|`build_omeka_pilot_import.py`|Produces the Omeka CSV Import payload for the pilot items.|2A pilot|
|`build_pilot_ris.py`|Generates RIS for pilot items where needed.|2A pilot|
|`build_pilot_public_cleanup_sql.py`|SQL to strip process tags (`source:quartz`, `status:needs-review`) from public subject display.|2A polish|
|`build_pdf_attachment_manifest.py`|Builds a manifest of which PDFs should attach to which pilot items.|2A pilot|
|`build_omeka_media_attach_csv.py`|Builds the CSV used by CSV Import's `Media source` column with the `url` ingester.|2A / 2B|
|`attach_pdfs_to_omeka.py`|Script-side PDF attachment by calling Omeka's media endpoint. Kept as a fallback to CSV Import.|2A / 2B|
|`assign_kaanu_ids.py`|**Canonical identifier minting.** Mints `kaanu:identifier` and `bibo:uri` together on every item that lacks one. fcntl-locked counter, idempotent, dry-run mode, CSV audit log.|2A, then ongoing|
|`record_other_dois.py`|**Pre-existing DOI capture.** Pattern-matches `10.NNNN/` strings in `dcterms:source`, `dcterms:identifier`, `dcterms:bibliographicCitation`, and any imported Zotero DOI field. Normalises and writes to `kaanu:otherDoi` (multivalued). No network. Run before the Zenodo minting pass.|2D-2, then ongoing|
|`mint_zenodo_dois.py`|**Canonical DOI minting.** For each record without `bibo:doi`, deposits to the Kaanu community on Zenodo via the deposit API and writes the minted DataCite DOI back to `bibo:doi`. Deposits the PDF where rights permit, metadata-only otherwise. CSV log per run.|2D-4, then ongoing|

The two scripts that will be used on every Omeka item, forever, are `assign_kaanu_ids.py` and `mint_zenodo_dois.py`. `record_other_dois.py` is also evergreen for any record imported with an external DOI. The rest are migration-phase tools.

## 6. Credentials

Credentials are held on your Mac only, never committed. The template is at `kaanu_credentials_template.md`; the filled version sits outside the repo. The current Omeka API key pair (label `cli-attach-v2`) is used by `assign_kaanu_ids.py`, `record_other_dois.py`, `mint_zenodo_dois.py`, and the migration scripts.

When the move to `archive.kaanu.org` happens, the API endpoint shifts from `https://new.kaanu.org/api` to `https://archive.kaanu.org/api`. All scripts read the base URL from a flag or environment variable, so the change is a single value, not a code edit.

**Zenodo credentials** (added in Phase 2D setup): a personal access token with `deposit:write` and `deposit:actions` scopes, generated from the Kaanu Zenodo account, stored in the same credentials file as the Omeka keys. The Kaanu community identifier on Zenodo (created once via the Zenodo UI) is also held here so `mint_zenodo_dois.py` can attach every deposit to the right community.

## 7. Migration workbench

The workbench at `migration/` holds the operational state of the legacy-to-Omeka migration.

- `migration/scripts/` is the tooling listed above.
- `migration/generated/` is CSVs and summaries produced by the inventory and pilot scripts (`quartz_inventory.csv`, `quartz_inventory_summary.md`, `pilot_quartz_sample.csv`, pilot attach CSV, pilot SQL).
- `migration/templates/` is the blank ledger header and the Omeka Phase 1 status checklist.
- `migration/kaanu_archivist_editor_handbook.md` is the authoritative operating document for the archivist and editor: identifier scheme, canonical URL rule, redirect policy, ledger columns, editorial workflow.
- `migration/README.md` explains how to regenerate the inventory and what still needs manual or remote work.

The handbook is the one document in `migration/` that is consulted during every import wave. The rest is machinery.

## 8. Routine operations

Day-to-day operations the archivist or editor needs to know. Fuller walkthroughs live in the handbook.

**Minting Kaanu identifiers.** Run `assign_kaanu_ids.py` with `--dry-run --limit 1` first, confirm the next ID looks right, then re-run without `--dry-run`. The counter file at `/var/www/omeka/data/kaanu_id_counter.txt` and the audit log at `/var/www/omeka/data/kaanu_id_assignment_log.csv` are the two artefacts to preserve.

**Importing a wave from Zotero.** Tag items in the Zotero group library with `status:ready-for-omeka`, then run the Zotero Import module on the filtered set. Verify item count before moving to PDF attachment. See Phase 2B in the current plan.

**Attaching PDFs.** Use CSV Import with the `Media source` column mapped to the `url` ingester. For the file-sideload path (PDFs on the droplet's local disk), use the File Sideload module once it is installed in Phase 2A.

**Backups.** DigitalOcean weekly backups are enabled at the droplet level. A second-factor backup to Backblaze B2 is an open item (see the current plan, Phase 2A setup checklist).

**TLS renewal.** Auto-renewed by the systemd timer certbot installs. Verify quarterly with `sudo certbot renew --dry-run`.

**DOI assignment.** Every Kaanu record receives a Zenodo-minted DOI in `bibo:doi`. Any pre-existing publisher DOI is captured in `kaanu:otherDoi` for cross-reference, not used as the canonical DOI. The two-step run on any record set:

1. Run `record_other_dois.py` first to lift any pre-existing DOI strings from `dcterms:source`, `dcterms:identifier`, `dcterms:bibliographicCitation`, or imported Zotero DOI fields into `kaanu:otherDoi`. Local pattern match, no network.
2. Run `mint_zenodo_dois.py` to deposit each record into the Kaanu community on Zenodo and write the minted DataCite DOI back to `bibo:doi`. Deposits the PDF where rights permit, metadata-only otherwise.

Each writes its own CSV log under `migration/generated/`. Dry-run each on a five-record sample before running against the full queue.

**Zenodo fair-usage caveat.** Akshay flagged that Zenodo has a fair-usage policy for bulk deposit (see [Zenodo support note on size limitations and fair usage](https://support.zenodo.org/help/en-gb/1-upload-deposit/80-what-are-the-size-limitations-of-zenodo)). The relevant red flags are: dividing a single large dataset into many records to circumvent the 50 GB upload limit, uploading very large numbers of records independent of data volume, and uploading content where the main purpose is indexing or archiving or promotion. Because Kaanu is a curated bibliographic archive at the scale of around 2,000 records, write to Zenodo for an upfront agreement on the use case before the first bulk run. If they decline records that already have a publisher DOI, the editor backstop applies: those records keep their existing DOI in `bibo:doi` and `kaanu:otherDoi` is left empty.

**SSH.** Key-only access for `daktre`; root login and password authentication are disabled. If a new maintainer needs access, add their public key to `~daktre/.ssh/authorized_keys`.

## 9. What still needs doing (as of 2026-04-25)

Items flagged as open or pending in the deployment log, mapped to the current plan's phases.

- Install Clean Url and File Sideload modules (Phase 2A).
- Register the Kaanu vocabulary (prefix `kaanu`, namespace `https://kaanu.org/ns/`, properties `identifier` and `otherDoi`) in Omeka admin (Phase 2A pre-flight).
- Move DNS to `archive.kaanu.org` and add the `/bib/*` proxy rule on `kaanu.org` (Phase 2A, once the static site exists).
- Run `assign_kaanu_ids.py` in live mode against the pilot items after dry-run confirmation (Phase 2A).
- Second-factor backup to Backblaze B2 or equivalent (Phase 2A setup).
- DO Space for file storage via `configure-spaces.sh`, before the platform holds real community uploads (Phase 2B setup).
- Optional: install Annotate, Comments, MetadataBrowse via git clone when those interactions become needed (Phase 2C or later).
- Optional: update `setup.sh` to pull Omeka S 4.2.x directly so future rebuilds skip the in-place upgrade.
- Confirm Zenodo's position on minting new DOIs for documents with existing publisher DOIs (Phase 2D-1, before the bulk run).
- Create the Kaanu Zenodo account, generate the personal access token, create the Kaanu community on Zenodo, record both in the credentials file (Phase 2D-3, one-time).

The current plan tracks these items against their phase; this page exists so anyone maintaining the live system can find them without reading the plan cover to cover.

## 10. Pointers

- **Plan:** `KAANU_PHASE_2_PLAN.md`
- **Historical reasoning:** `HISTORICAL_PLANNING.md`
- **Deployment log (full history):** `kaanu_deployment_log.md`
- **Archivist / editor handbook:** `migration/kaanu_archivist_editor_handbook.md`
- **Credentials template:** `kaanu_credentials_template.md`
- **Deployment scripts:** `infra/`
- **Migration workbench:** `migration/`