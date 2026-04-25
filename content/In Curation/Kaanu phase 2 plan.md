# Kaanu Phase 2 Plan

**Last updated:** 2026-04-25

Supersedes the [[Kaanu Integrated Platform (archived)|integrated platform plan]].
Based on this, we had the [[kaanu phase 2 ops plan april 2026]]

## 1. What should the tech component enable for Kaanu?

Kaanu is an independent South Indian Adivasi studies archive plus collection plus commentary and annotation plus events and discussion platform on these issues. It collects, curates, and makes discoverable a corpus of bibliographic records, annotated PDFs, and associated multimedia, with attention to Karnataka, Kerala, and Tamil Nadu.

In Phase 2 we shall build the public archive, the stable URL and identifier layer underneath it, a lightweight public-facing site, and the pipelines to move the full collection. We aim for a visualisation similar to what Obsidian-Quartz used to produce, showing the inter-relationships between items in the collection.

The target state has three visible faces at launch:

1. A static home site at `kaanu.org` that signposts visitors to the archive, the blog and commentary section, the charter and membership page, and the events calendar.
2. The archive at `archive.kaanu.org`, running [Omeka S](https://omeka.org/s/). Every bibliographic record, PDF, and future non-PDF media item lives here. Stable URLs on the `kaanu.org` domain resolve to archive items.
3. The stable URL layer: every archive record carries a permanent identifier and a canonical URL on the `kaanu.org` domain, independent of the Omeka internal item ID or file path.

A visualisation layer showing relationships between items, aggregated by keyword, community, region, era, author, and subject, is deferred to Phase 3.

## 2. Where we are today

|Thing|State|
|---|---|
|Droplet|Live at `168.144.66.105`, BLR1, Ubuntu 24.04 LTS, 2 vCPU / 4 GB, DO weekly backups on, SSH key-only|
|LEMP stack|nginx 1.24, PHP 8.3-FPM, MySQL, all installed|
|TLS|Let's Encrypt via certbot, auto-renewal verified|
|Omeka S|4.2.x, live; current public host `new.kaanu.org` (to be moved to `archive.kaanu.org`)|
|Modules active|CSV Import, Zotero Import, Value Suggest, Collecting, Common, Advanced Resource Template, Contribute, Selection (eight modules)|
|Modules pending|File Sideload, Clean Url, Kaanu (custom)|
|Pilot items in Omeka|10 (item ids 1 to 10)|
|PDFs attached|1 so far (media id 12 on item 2), as a proof that API attach works|
|API write path|Working with `cli-attach-v2` key (after fixing a broken key row in Phase 0)|
|Legacy PDF host|`attachments.kaanu.org`, around 843 PDFs, to be retired|
|Incoming batch|Around 1,000 annotated PDFs on local disk, each with source URL embedded on page 1|
|Stable URL layer|Not implemented. Items use Omeka internal IDs only|
|Static home site|Not started|

## 3. Target architecture

### Domain strategy

- `kaanu.org` is the public domain. The home page, blog, charter, and events live here.
- `archive.kaanu.org` is the Omeka S subdomain. Search, browse, item pages, and contribute flows run here.
- Stable URLs use the `kaanu.org` form: `kaanu.org/bib/{kaanu_id}`. During the pilot these are stored in the record's `bibo:uri` property. When the main `kaanu.org` host is ready, an nginx rule proxies `/bib/*` to `archive.kaanu.org/bib/*` so the canonical URL resolves directly on the parent domain.

### One diagram

```
                   kaanu.org (static host)
                     |
           __________|_____________________________________________
          |              |               |              |         |
         /             /blog           /charter       /events    /bib/{id}
      Home (static)  Blog / essays   Charter +        Events     -> proxies to
      signpost       (commentary)    Membership       (physical/    archive.kaanu.org/bib/{id}
                                                      hybrid)

                           archive.kaanu.org (Omeka S)
                                  |
                           ___________________
                          |                   |
                        /search             /s/kaanu/...
                        /browse             (native Omeka paths,
                        /contribute          301 to /bib/{id} via Clean Url)
                        /bib/{id}
```

### Stable URL scheme

Per the [[Kaanu archivist handbook]]:

- Permanent identifier: `kb` plus 6 zero-padded digits (`kb000001` to `kb999999`).
- Canonical item URL: `https://kaanu.org/bib/{kaanu_id}`.
- Canonical download URL: `https://kaanu.org/bib/{kaanu_id}/download`.
- Identifier is assigned once, never reused, never extension-dependent.
- Merged records: one `kaanu_id` becomes canonical, the other is retired and redirects to the canonical.

Two properties carry this on every Omeka record:

- `kaanu:identifier` (literal) holds the opaque `kbNNNNNN` string. Local vocabulary, prefix `kaanu`, namespace `https://kaanu.org/ns/`. Primary internal anchor.
- `bibo:uri` (URI) holds the full `https://kaanu.org/bib/{id}` stable URL. BIBO is bundled with Omeka. This is what citation exports, sitemaps, external links, and the on-page "Stable URL" line use.

A third property carries the DOI on every record (added in Phase 2D):

- `bibo:doi` (literal) holds the canonical Kaanu DOI, minted by Zenodo for every record.

A fourth property captures any pre-existing DOI:

- `kaanu:otherDoi` (literal, multivalued) holds any external publisher DOI (CrossRef, DataCite-elsewhere, etc.) for cross-reference. New property added to the Kaanu vocabulary.

## 4. Media and rendering strategy

### PDF-first but not PDF-only

The current corpus is almost entirely PDFs. The infrastructure we build supports PDF as the primary media type, but the data model and rendering layer must not assume PDF. Image items (photographs from BR Hills, scans of archival material), audio items (oral history recordings), video items (community-recorded footage), and narrative items (community portraits, exhibits) all need a home in the same archive. Omeka S supports all of these natively.

Concretely:

- The inline viewer on the item page renders a PDF via a browser-native iframe when the primary media is PDF (compare the lightweight viewer at [gpura.org](https://gpura.org/item/1943-11-nov-19-yudhasanchika)). For images it renders an `<img>`. For audio and video it uses the native `<audio>` and `<video>` elements. For narrative items with no primary media it renders the metadata and description without a viewer block.
- Resource templates are multiple. `Bibliographic Item` for papers and books. `Image Item`, `Audio Item`, `Video Item` for multimedia. `Community Portrait` for narrative-heavy entries. All share `kaanu:identifier`, `bibo:uri`, `bibo:doi`, and `kaanu:otherDoi`; the core identifier, URL, and DOI scheme is universal.
- The `/bib/{id}/download` endpoint returns the primary media file regardless of format. A reader clicks download and gets whatever the primary media is.

### Item page layout

1. Title and citation block at top (author, year, source).
2. **Stable URL** line with copy-to-clipboard, JSTOR-style. Example: `Stable URL: https://kaanu.org/bib/kb000001`.
3. **DOI** line, also copy-to-clipboard. Example: `DOI: 10.5281/zenodo.NNNNNNN`. If `kaanu:otherDoi` is present, render a secondary line: `Publisher DOI: 10.NNNN/...`.
4. **Download** button, prominent. Serious readers will download for annotation anyway.
5. Inline viewer (iframe for PDF, native element for media, lazy-loaded so it does not block page paint).
6. Metadata panel below (rights, subjects, communities, regions, era, notes, related items).

### DOI policy: one Kaanu DOI per record, plus any "Other DOI"

Every Kaanu record gets a Zenodo-minted DataCite DOI. This is the single canonical Kaanu DOI, written to `bibo:doi`.

Where a record already has a DOI from elsewhere (publisher CrossRef DOI for journal articles and books, DataCite DOI from another repository, etc.), that pre-existing DOI is captured separately in `kaanu:otherDoi` and surfaced on the item page as a "Publisher DOI" line. Pre-existing DOIs are kept for cross-reference; they do not replace the Kaanu Zenodo DOI.

Zenodo is operated by CERN and OpenAIRE, mints proper DataCite DOIs, and is free for non-commercial use. Depositing into the Kaanu Zenodo community gives every record citation-grade permanence on a globally indexed scholarly handle. The Kaanu identifier (`kb000001`) and stable URL (`kaanu.org/bib/kb000001`) remain the primary internal references; the DOI is the external scholarly-ecosystem reference.

**Open question (per ASD email):** confirm Zenodo's position on minting new DOIs for documents that already carry a publisher DOI. Zenodo's fair-usage guidance flags "uploading content where the main purpose is indexing, archiving, or promotion" as outside fair usage; minting fresh DOIs for already-published journal articles may fall on the wrong side of that line. The plan below assumes Zenodo accepts every record. If they decline a class of records (typically published journal articles with existing CrossRef DOIs), the editor backstop is to use the existing DOI as `bibo:doi` for those records and leave `kaanu:otherDoi` empty. This is settled before the first live Zenodo deposit run.

## 5. Phase 2A: URL layer on the pilot

Immediate. One to two weeks. Everything downstream depends on this layer being correct and verified on the 10 pilot items before any bulk work begins.

### 2A-1. Move Omeka from `new.kaanu.org` to `archive.kaanu.org`

DNS change at GoDaddy: add A record for `archive.kaanu.org` pointing at `168.144.66.105`. nginx server block: extend `server_name` to include `archive.kaanu.org` alongside `new.kaanu.org`. Re-run certbot for the expanded domain set. Update Omeka's site base URL and file base URL in admin. Keep `new.kaanu.org` responding as an alias (301 to `archive.kaanu.org`) until at least 60 days pass with no references in logs, then retire.

### 2A-2. Create the Kaanu vocabulary and properties

Admin -> Vocabularies -> Add:

```
Label:          Kaanu
Prefix:         kaanu
Namespace URI:  https://kaanu.org/ns/
```

Add two properties to it: `identifier` (label "Kaanu identifier") and `otherDoi` (label "Other DOI"). Confirm the BIBO vocabulary is present (it ships with Omeka S); BIBO supplies `bibo:uri` and `bibo:doi`. These four properties are the only vocabulary pieces needed for the identifier and DOI layer.

### 2A-3. Run `assign_kaanu_ids.py` on the 10 pilot items

The script is already written at `migration/scripts/assign_kaanu_ids.py`. It finds items missing `kaanu:identifier`, mints a new `kb`-prefixed ID from a monotonic counter with an exclusive file lock, and writes both `kaanu:identifier` and `bibo:uri` together. Idempotent: safe to run on a cron or after any intake script.

Counter file at `/var/www/omeka/data/kaanu_id_counter.txt`. Assignment log at `/var/www/omeka/data/kaanu_id_assignment_log.csv`.

First run: dry-run with `--limit 1`, confirm output. Then live run with no limit. Expected outcome: pilot items 1 to 10 get `kb000001` to `kb000010` in item-ID order.

### 2A-4. Build the Kaanu Omeka module

Small custom module (`/var/www/omeka/modules/Kaanu/`), about three files:

- `module.config.php`: registers two routes.
    - `/bib/{id}` looks up the item by `kaanu:identifier`, 301s to the item's canonical Omeka URL, or serves a themed item page directly.
    - `/bib/{id}/download` looks up the item, finds its primary media, checks visibility and rights, streams the file or 302s to the Omeka file URL. Returns 404 if no media, 403 if not public.
- `src/Controller/IndexController.php`: the two route handlers.
- `view/omeka/site/item/show.phtml`: theme override that adds the Stable URL line, the DOI line(s), the Download button, and the inline viewer above the metadata panel. Branches on media MIME type: PDF -> iframe, image -> `<img>`, audio -> `<audio>`, video -> `<video>`, none -> metadata only.

The Clean Url module can handle the first route declaratively (configure the main path to `bib` and the item identifier property to `kaanu:identifier`), so in practice the Kaanu module owns only the `/download` route and the theme override. This is a conscious split: Clean Url is a generic well-maintained module that knows how to map identifier-to-item across the admin surface; the Kaanu module holds only the bespoke parts that are not generic.

### 2A-5. Install Clean Url and configure

Module installation steps are the boilerplate already used for other Daniel-KM modules. Configuration:

- Main path: `bib`
- Default URL: generic (custom)
- Item identifier property: `kaanu:identifier`
- Include site slug in URL: no
- Redirect legacy numeric URLs: yes, 301

Result: `archive.kaanu.org/bib/kb000001` resolves to the item page. Omeka's native `/s/kaanu/item/2` path 301s to it.

### 2A-6. nginx body size

`client_max_body_size 100M` in the server block. Some PDFs in the corpus are larger than the default 1 MB. Reload nginx.

### 2A-7. Verify on the 10 pilot items

For each of the 10:

1. `archive.kaanu.org/bib/kb00000N` loads the item page.
2. Stable URL line shows `https://kaanu.org/bib/kb00000N` with a copy button.
3. If media is attached: inline viewer renders, Download button works, `/bib/kb00000N/download` returns the file.
4. If no media: metadata-only layout, no viewer block, `/download` returns 404.
5. Old path `archive.kaanu.org/s/kaanu/item/N` 301s to `/bib/kb00000N`.

Also verify the Contribute module is wired into the site navigation for logged-in members, and that a test submission through the Contribute form lands in the review queue rather than becoming visible immediately.

Phase 2A exit gate: all 10 verifications pass. Until then, do not start Phase 2B.

## 6. Phase 2B: Legacy 843 Quartz migration

Two to four weeks.

### 2B-1. Pilot cleanup

Tasks from the site improvements list, done against the 10 pilot items first:

- Attach all 10 PDFs via File Sideload (current state: 1 attached, 9 pending).
- Replace import-note descriptions with either real abstracts or the placeholder `Imported from the Kaanu pilot bibliography migration.`
- Remove workflow tags (`source:quartz`, `status:needs-review`) from public subject values. Keep in an internal field only.
- Write a short `About the Pilot` page at `archive.kaanu.org/s/kaanu/page/about-pilot`.

### 2B-2. Rights triage on the full 843

Populate `pdf_rights_status` on every row of the migration ledger. First pass by heuristic:

|Original source|Default rights status|
|---|---|
|Government and NGO open-access (iwgia.org, worldbank.org, pib.gov.in, etc.)|`file-public`|
|Author-hosted PDF on a university repository|`file-public`|
|Pre-prints (arXiv, SSRN, bioRxiv)|`file-public`|
|Open-access journals|`file-public`|
|JSTOR, Taylor & Francis, Science, Elsevier, Wiley, Springer|`metadata-only` (paywalled by default)|
|Academia.edu|`metadata-only` (author-uploaded but platform-gated)|
|Blogs, news articles originally public|`file-public`|
|Unknown or unidentifiable|`needs-review`|

Heuristic is implemented as `scripts/apply_rights_heuristic.py` (to be written), which reads the ledger and writes `pdf_rights_status` for every row. Editor then walks the `needs-review` rows. Rough budget: 30 seconds per decision with heuristic pre-filled, so 843 records is about 7 hours, split across sessions.

### 2B-3. Identifier sweep for the full corpus

After intake, run `assign_kaanu_ids.py` to assign `kb000011` onwards to the 833 not-yet-imported records in ledger-seen order. The counter file carries across all phases and all batches without special handling.

### 2B-4. Metadata import in waves

Wave runner (`run_import_wave.py`, to be written) selects rows where `import_status = ready-for-omeka-import`, takes the first N (default 100), generates the wave's CSV, runs Omeka's CSV Import, and writes back the resulting Omeka item IDs to the ledger.

Import CSV columns per row:

- `kaanu:identifier` (the `kbNNNNNN`)
- `dcterms:title`
- `dcterms:creator` (multivalued, `;` separator)
- `dcterms:date`
- `dcterms:subject` (from keywords, multivalued)
- `dcterms:source` (original source URL)
- `dcterms:description`
- `dcterms:type`
- `kaanu:otherDoi` if known at intake (any pre-existing DOI; otherwise filled by `record_other_dois.py` in Phase 2D)
- `kaanu:zotero_bridge` (the `zotero://groups/6516878/items/<key>` form)
- `bibo:uri` (computed as `https://kaanu.org/bib/{kaanu_id}`)

`bibo:doi` is intentionally not written at this stage. It is filled in Phase 2D after the Zenodo deposit pass.

Resource template: `Bibliographic Item`. Visibility: public (unless rights say otherwise). Multivalue separator: `;`.

Run waves until `ready-for-omeka-import` queue is empty. After each wave, spot-check 5 random records at `archive.kaanu.org/bib/kbNNNNNN` to catch mapping regressions early.

### 2B-5. PDF staging and File Sideload attach

All PDFs pass through one canonical staging directory on the droplet, renamed to `<kaanu_id>.pdf`:

```
/var/www/omeka/files-sideload/kb000001.pdf
/var/www/omeka/files-sideload/kb000002.pdf
...
```

`stage_legacy_pdfs.py` (to be written) reads the ledger, for each row with `pdf_rights_status = file-public` and a reachable source URL, downloads the PDF and copies it to the staging directory with the `kaanu_id` as filename. Marks the row `pdf_staged = yes`.

`run_attach_wave.py` (to be written) selects rows where `import_status = imported-to-omeka`, `pdf_staged = yes`, `attach_status` is empty, and the staged file exists. Runs CSV Import in Update mode with the File Sideload ingester, one wave of N (default 100) at a time. Writes back the `media_id` and sets `attach_status = media-attached`.

`metadata-only` rows are skipped at staging. `file-private` rows are staged and attached but with private visibility on the Omeka media.

### 2B-6. Verification pass

Random spot-check of 30 records across waves:

- Item page at `archive.kaanu.org/bib/kbNNNNNN` loads.
- Metadata is complete.
- Public PDF `/download` serves without auth.
- Metadata-only items show source link but no viewer.
- Search returns the item for a distinctive title phrase.
- Sitemap includes the canonical `/bib/...` URL, not the Omeka numeric path.

## 7. Phase 2C: Incoming 1,000+ annotated PDFs

Two to three weeks.

### 2C-1. Extract the source URL from each PDF

`extract_urls_from_pdfs.py` (to be written) walks the incoming folder, opens each PDF, extracts page 1 text via PyMuPDF, regexes for HTTP(S) URLs, and writes `generated/incoming_pdf_urls.csv` with one row per PDF: filename, extracted URL, extraction confidence, notes.

Expected hit rate on a PDF-with-URL-on-page-1 corpus: 95 per cent plus. Flag multiple-URL or no-URL cases for editor review.

### 2C-2. Editor URL review

Editor reviews the extraction CSV, corrects misses, flags duplicates against the existing 843 corpus (fuzzy title match or URL match).

### 2C-3. Auto-fill metadata via Zotero

`batch_add_to_zotero.py` (to be written) reads the reviewed CSV and POSTs each URL to the Zotero group library via the Zotero API. Zotero's web translators auto-fill title, authors, year, DOI, abstract, item type for most academic URLs. Batch tags each with `source:annotated-pdf-batch` and `status:needs-review`.

Zotero rate limit is permissive (around 90 requests per minute). 1,000 URLs in roughly 12 minutes.

### 2C-4. Editor Zotero review

Editor walks the Zotero group, fixes bad metadata (Zotero's translator misses or misfires), applies Kaanu's subject, community, region, and era tags, and marks ready with `status:ready-for-archive`.

### 2C-5. Import to Omeka, assign IDs, stage and attach PDFs

Same pipeline as Phase 2B-4 through 2B-5, just with Zotero Import module as the source instead of CSV Import. `assign_kaanu_ids.py` mints fresh `kaanu_id` values (`kb000844` onwards, or wherever the counter sits).

`stage_incoming_pdfs.py` (to be written) handles the local-folder-to-droplet rsync with rename. For each Omeka item imported from the incoming batch, find the original PDF by Zotero item key on disk, rsync to `/var/www/omeka/files-sideload/<kaanu_id>.pdf`.

Then `run_attach_wave.py --all` drains the queue as before.

## 8. Phase 2D: DOI acquisition via Zenodo

One to two weeks. Runs after Phases 2B and 2C, when the corpus is in Omeka and PDFs are attached. Every eligible record gets a Zenodo-minted DataCite DOI in `bibo:doi`. Pre-existing DOIs from elsewhere are captured in `kaanu:otherDoi` for reference. There is one canonical Kaanu DOI per record.

### 2D-1. Confirm Zenodo's policy on records with existing DOIs

Before any deposit, write to Zenodo support (per ASD email) and confirm whether they will issue a DataCite DOI for documents that already carry a publisher CrossRef DOI. Two outcomes shape the rest of the phase:

- **If yes:** every Kaanu record gets a fresh Zenodo DOI in `bibo:doi`, regardless of pre-existing DOIs. Pre-existing DOIs go in `kaanu:otherDoi`.
- **If no for a class of records (typically already-published journal articles):** for that class, the pre-existing DOI is written to `bibo:doi` directly and `kaanu:otherDoi` stays empty. Records outside that class still get a Zenodo DOI.

Document the answer in the deployment log and in the archivist handbook before running anything.

### 2D-2. Capture existing DOIs into `kaanu:otherDoi`

`record_other_dois.py` (to be written) reads every Omeka item and scans `dcterms:source`, `dcterms:identifier`, `dcterms:bibliographicCitation`, and any imported Zotero `DOI` field for `10.NNNN/...` patterns. Found DOIs are normalised (lowercased, trailing punctuation stripped, prefix-form without `https://doi.org/`) and written to `kaanu:otherDoi`. No network call. Multivalued: a record can have more than one external DOI (rare but possible).

Output: `generated/other_doi_capture_log.csv` with one row per record showing which field the DOI came from and what was written.

### 2D-3. One-time Zenodo setup

Before the first live deposit run:

1. Create a Zenodo account for Kaanu (use `contact@kaanu.org` if it exists, otherwise the editor's address).
2. Create the "Kaanu" community on Zenodo via the Zenodo UI. Record the community identifier.
3. Generate a personal access token with `deposit:write` and `deposit:actions` scopes. Store the token and the community identifier in the credentials file alongside the Omeka API key.
4. Test deposit: deposit one pilot record by hand via Zenodo's UI, confirm the resulting DataCite DOI resolves, confirm the record sits inside the Kaanu community.

### 2D-4. Mint Zenodo DOIs for every eligible record

`mint_zenodo_dois.py` (to be written) reads every Omeka item that is missing `bibo:doi` and whose rights field permits external public deposit, and deposits each into the Kaanu community on Zenodo. Zenodo mints a DataCite DOI; the script writes the DOI to `bibo:doi` on the Omeka record.

Per-record Zenodo deposit payload:

- `title`, `creators`, `publication_date`, `description` from the Omeka record
- `resource_type`: mapped from the Kaanu resource template (`Bibliographic Item` -> `publication/article` or `publication/report`; `Image Item` -> `image/*`; `Audio Item` -> `audio`; `Video Item` -> `video`; `Community Portrait` -> `publication/other`)
- `communities`: `[{"identifier": "kaanu"}]`
- `related_identifiers`: the Kaanu stable URL (`https://kaanu.org/bib/<kaanu_id>`) as `isAlternateIdentifier`; any value in `kaanu:otherDoi` as `isIdenticalTo` or `isVersionOf` (depending on type)
- `keywords`: subjects, communities, regions, and era from the Omeka record
- `access_right`: `open` for public records; metadata-only deposit for records whose PDF cannot be redistributed but whose metadata can
- The PDF itself, if the rights field permits attachment on Zenodo

Rights gate. Records held back from Zenodo:

1. Anything whose `dcterms:rights` flags community-sensitive or member-only access.
2. Anything still flagged `status:needs-review` in Zotero or Omeka.
3. Anything where Phase 2D-1 concluded Zenodo will not mint (those keep their existing DOI in `bibo:doi`, set by `record_other_dois.py`).

Output: `generated/zenodo_mint_log.csv` (minted DOI, Zenodo record URL, deposit timestamp) plus `generated/zenodo_held_back.csv` (records skipped and the rule that skipped them, for editor review).

First live run: mint DOIs for five records, verify on Zenodo's UI that the records look right, then release the script against the full queue.

### 2D-5. Verification

Random spot-check of 30 records across the run:

- `bibo:doi` is present and resolves via `https://doi.org/<bibo:doi>`.
- The Zenodo record sits inside the Kaanu community.
- The Zenodo record carries the `isAlternateIdentifier` link back to `kaanu.org/bib/<kaanu_id>`.
- The Kaanu item page shows the DOI line; if `kaanu:otherDoi` is present, both DOI lines appear.
- For records held back: `bibo:doi` is either populated from `kaanu:otherDoi` (per 2D-1) or empty with a documented reason in the log.

## 9. Phase 2E: Static home site and public launch

Two weeks.

### 2E-1. Design the home site

`kaanu.org` hosts four to five pages, all static HTML:

- `/` (home): one-paragraph introduction, four signpost tiles (Archive, Blog, Charter and Membership, Events), a latest-items strip pulled from the Omeka RSS at `archive.kaanu.org/api/items?sort_by=created`, footer with contact and licensing.
- `/blog`: index of commentary and interpretation essays. Each essay is a Markdown file in the site repository rendered to HTML at build time, or a WordPress install if that better fits the editorial cadence (see 2E-2). Linked from items: a commentary essay on an item includes a "Cited items" block that links back to `/bib/{id}`.
- `/charter`: the Kaanu charter, membership tiers, application process. Plain HTML with a contact form.
- `/events`: upcoming and past events at the physical Kaanu centre and online. Simple chronological listing. A Google Calendar or ICS embed is sufficient for v1.

### 2E-2. Pick and set up the site engine

Two viable options:

- **Astro / 11ty / Hugo (static).** Markdown plus a build step. Fast, cheap to host, simple to back up. Good fit if the blog stays editor-curated and updates are deliberate.
- **WordPress.** Heavier but with native support for editorial workflows, scheduled publishing, comments, and a calendar plugin for events. ASD recommendation given that events and blog or commentary are expected to drive frequent updates.

Decision is pending (see Section 13). Both options can serve `/bib/*` via the same nginx proxy; the engine choice does not affect the archive layer.

### 2E-3. Blog and commentary editorial workflow

Each essay is a Markdown file (or WordPress post) with frontmatter:

```markdown
---
title: "XXXX"
author: Name
date: 2026-06-01
cites: [kb000042, kb000117, kb000238]
tags: [forest-rights, Soliga, governance]
---

Essay body in Markdown.
```

The `cites` array drives the "Cited items" block at the foot of the essay and also contributes to a reverse index on the archive side: visiting `archive.kaanu.org/bib/kb000042` eventually shows a "Cited in" link back to the essay. The reverse index is populated by a script that walks the blog repo (or queries the WordPress API) and POSTs back-references to the Omeka records after each deploy.

### 2E-4. Charter and membership

Charter text is authored elsewhere (a draft is in preparation with Pushpaja and Werner; outside the scope of this plan). Once ready, it becomes `/charter/index.html` (or the equivalent on WordPress). Membership tiers, criteria, and application process sit on the same page or a sub-page at `/charter/membership`. Application is via a simple form that emails `contact@kaanu.org` (or equivalent), reviewed by the editor.

### 2E-5. Events

Flat listing page. For v1, events are added as Markdown entries in an `events/` directory in the site repo (or as WordPress events posts), rendered at build time. Sufficient for the early cadence of the physical Kaanu centre. If event frequency grows, replace with a calendar connector later.

### 2E-6. Domain cutover and `/bib/*` proxy

Final configuration:

1. Point `kaanu.org` and `www.kaanu.org` at the droplet (GoDaddy DNS change).
2. nginx on the droplet gains a `kaanu.org` server block serving `/var/www/kaanu-home/` (or fronting the WordPress install, depending on 2E-2).
3. Inside that server block, `/bib/*` is a reverse proxy to `archive.kaanu.org/bib/*`, preserving path and query. This is what makes `kaanu.org/bib/kb000001` resolve via the parent domain.
4. HSTS and a proper security header set.
5. Re-run certbot for the expanded domain set.

When this is live, every stable URL minted from Phase 2A onwards resolves on the user-facing `kaanu.org` domain. The `archive.kaanu.org` URLs continue to work and function as the canonical path internally; the proxy is the user-facing veneer.

### 2E-7. Soft launch

Share `kaanu.org` with a small founding cohort. Collect feedback for two to four weeks. Fix obvious issues. Then broader launch.

## 10. Phase 3 preview: visualisation (deferred)

Not in Phase 2. Noted here so the data model stays compatible.

Aim: a visual layer that shows each item's relationship to other items in the archive, aggregated by shared keyword, community, region, era, author, or subject. A researcher landing on one item can see the neighbourhood of related items at a glance and walk the graph.

Two viable implementations to choose between when the time comes:

- **Quartz rebuild.** A cron-driven script fetches all items from the Omeka API, writes one Markdown file per item with YAML frontmatter and wiki-links to facet pages, runs Quartz's static build, and deploys to `kaanu.org/graph`. Quartz's graph view, backlinks, and search come with the package. Update cost: rerun the script whenever the archive changes. Lock-in: low; if Quartz ever falls out of favour, replace with the same pattern targeting a different engine.
- **Purpose-built viewer.** A D3 or Sigma.js visualisation driven by a JSON export from the Omeka API. More control, more maintenance, no lock-in to anyone else's tooling.

Decision deferred until the archive has enough content that the visualisation is meaningful (roughly once Phase 2B and 2C are done, so 1,800 plus records). Data model today does not need any change to support either path; both read from the Omeka API.

## 11. Guiding principles (load-bearing, read once)

These four rules govern every script in the pipeline. They are what lets the same code run unchanged whether the corpus is 10 rows, 1,843, or 10,000.

1. **Ledger is the single source of truth.** Scripts read it, transform it, and write back to it. No script hardcodes a record count, a range, or a specific identifier. "Process all rows where `import_status` is `ready-for-omeka-import`" is the right shape.
2. **Identifier assignment is monotonic and stateful.** A counter file on the droplet holds the last assigned number. New records ask for the next one. No script ever re-numbers existing rows. No script assumes the corpus is numbered sequentially from 1 to N.
3. **Every operation is idempotent.** Re-running any part of the pipeline produces no duplicates, no re-imports, no re-attaches. Each script checks the row's current state and skips rows that are already done.
4. **Intake is pluggable.** Records enter the ledger through an intake adapter per source. The rest of the pipeline does not care where a row came from. Today's adapters cover Quartz vault, incoming annotated PDFs, and Zotero. Adding a new source means writing one script and reusing everything else.

### Record state machine

Every ledger row moves through these states:

```
  (intake adapter)
         |
         v
   [ new-intake ]
         |
         v
(rights triage, editor)
         |
         v
  [ ready-for-omeka-import ]
         |
         v
 (metadata wave import)
         |
         v
  [ imported-to-omeka ]
         |
         v
 (PDF staging + sideload attach)
         |
         v
   [ media-attached ]
         |
         v
 (DOI acquisition via Zenodo)
         |
         v
    [ doi-resolved ]
         |
         v
     (verification)
         |
         v
      [ verified ]
```

`doi-resolved` is reached whether the DOI was minted by Zenodo (the default path) or carried over from `kaanu:otherDoi` (the editor backstop for records Zenodo declined to mint). Records held back entirely (community-sensitive material) transition to `doi-resolved` with `bibo:doi` empty and a documented reason.

Withdrawn, merged, or suppressed records are parallel terminal states, not failures. Script logic treats them as "do not attempt further action".

## 12. Scripts and modules, inventory

Already written:

- `migration/scripts/assign_kaanu_ids.py` (Phase 2A-3)
- `migration/scripts/build_quartz_inventory.py` (intake adapter for Quartz vault, Phase 2B-3)
- `migration/scripts/attach_pdfs_to_omeka.py` (proof of concept for URL-ingest attach; superseded by File Sideload approach but kept for reference)
- All the `build_*` scripts that produce the pilot CSVs

To be written, in order:

|Order|Script or module|Purpose|Phase|
|---|---|---|---|
|1|`Kaanu` Omeka module|`/bib/{id}/download` route, item page theme override (DOI lines, viewer, Download button)|2A-4|
|2|`apply_rights_heuristic.py`|First-pass population of `pdf_rights_status`|2B-2|
|3|`run_import_wave.py`|Wave-based metadata import|2B-4|
|4|`stage_legacy_pdfs.py`|Download, rename, stage PDFs from `attachments.kaanu.org`|2B-5|
|5|`run_attach_wave.py`|Wave-based File Sideload attach|2B-5 and 2C-5|
|6|`extract_urls_from_pdfs.py`|Pull source URL from page 1 of incoming PDFs|2C-1|
|7|`batch_add_to_zotero.py`|Auto-fill metadata via Zotero translators|2C-3|
|8|`stage_incoming_pdfs.py`|Rename and rsync incoming PDFs to staging directory|2C-5|
|9|`record_other_dois.py`|Capture pre-existing DOIs into `kaanu:otherDoi`|2D-2|
|10|`mint_zenodo_dois.py`|Deposit every eligible record into the Kaanu Zenodo community, write minted DataCite DOI back to `bibo:doi`|2D-4|
|11|Static site or WordPress|Home, blog, charter, events|2E|
|12|`publish_blog_backrefs.py`|Write "Cited in" back-references from blog essays to archive items|2E-3|

## 13. To be resolved

Seven open decisions that shape concrete implementation steps. Settle each before the relevant phase starts.

1. **Counter starting point.** Defaults to 0, so first mint is `kb000001`. Confirm.
2. **Rights heuristic table (section 2B-2) acceptable as default?** If stricter or more permissive than desired, specify the cut before 2B-2.
3. **Wave size.** Default is 100. Confirm or adjust. Smaller is safer on rollback, larger is faster.
4. **Site engine for `kaanu.org`.** Astro / 11ty / Hugo (static), or WordPress (per ASD). Decide before 2E-2.
5. **Initial member cohort and charter timing.** Charter draft state with Pushpaja and Werner. Founding cohort list. These gate public launch (2E-7), not earlier phases.
6. **Mail for `contact@kaanu.org`.** Day-one provider (Fastmail, Migadu, self-hosted) or a contact form pointing at a personal inbox for v1?
7. **Zenodo's position on records with existing DOIs (per ASD email).** Confirm whether Zenodo will mint a fresh DataCite DOI for documents already carrying a publisher CrossRef DOI. The answer determines whether every record gets a Zenodo DOI in `bibo:doi`, or whether already-published articles keep their existing DOI in `bibo:doi` instead.

## 14. Cutover criteria (when we call Phase 2 done)

All of the following, in order:

1. `archive.kaanu.org` is live and stable.
2. All 843 legacy records are in Omeka with `kaanu_id`, rights classified, and media attached where public.
3. All 1,000-plus incoming annotated PDFs are in Omeka with same.
4. DOI acquisition complete: every eligible record has `bibo:doi` populated (Zenodo-minted by default, pre-existing DOI as backstop where 2D-1 dictated). Pre-existing DOIs captured in `kaanu:otherDoi` where present. Held-back records have a documented reason in the log.
5. `kaanu.org` static (or WordPress) site is live.
6. `kaanu.org/bib/{id}` resolves for every record, via the proxy.
7. Legacy URL redirect map is in place at nginx.
8. `attachments.kaanu.org` is retired.
9. `new.kaanu.org` is retired (or redirects).
10. Sitemap, robots.txt, and OAI-PMH are generating correctly from canonical URLs.
11. Soft-launch feedback window has closed and critical feedback is addressed.

At that point Phase 3 (visualisation, ongoing curation, member submissions at scale) can begin.