Rolling working document for bibliography migration, identifier assignment, URL permanence, and editorial operations during the current Omeka staging phase.

**Last updated:** 2026-04-25 **Current platform:** `https://new.kaanu.org` (to be moved to `archive.kaanu.org`) 
**Current legacy source:** Quartz/Obsidian vault plus WIKINDX where recoverable

## Purpose

This handbook is the practical operating document for the Kaanu archivist/editor.

Use it to keep the following stable across migration waves:

- what gets imported
- how records are identified
- what public URLs mean
- how redirects are managed
- when PDFs can be made public
- what the current batch status is

## Current operating decisions

- Omeka S is the staging archive and current system of record.
- Zotero is the migration buffer and editorial cleanup layer.
- Quartz remains the legacy source until migration is complete.
- PDFs should be batch-attached through Omeka workflows, not manually item by item.
- Public item URLs must be permanent and independent of Omeka internal IDs.

## Permanent identifier rule

Every bibliographic record gets one permanent Kaanu identifier at the moment it is accepted into the migration ledger.

### Format

- Prefix: `kb`
- Numeric body: zero-padded 6 digits
- Examples:
    - `kb000001`
    - `kb000842`

### Rule

- The identifier is assigned to the intellectual record, not to a particular file path.
- Once assigned, a `kaanu_id` is never reused.
- If a record is withdrawn, merged, or suppressed, its `kaanu_id` remains reserved.
- If two records are merged, one `kaanu_id` becomes canonical and the other becomes a retired identifier that redirects to the canonical record.

### Assignment practice

- Assign identifiers sequentially from the migration ledger.
- Do not wait for final publication to assign a `kaanu_id`.
- The `kaanu_id` should be stored in:
    - the migration ledger
    - Omeka as a persistent identifier field
    - any redirect map
    - any future export or API feed

## Permanent URL rule

Kaanu should use one identifier-based canonical public URL for each item.

### Canonical item URL

Pattern:

- `https://kaanu.org/bib/{kaanu_id}`

Examples:

- `https://kaanu.org/bib/kb000001`
- `https://kaanu.org/bib/kb000842`

### Canonical PDF URL

Pattern:

- `https://kaanu.org/bib/{kaanu_id}/download`

Example:

- `https://kaanu.org/bib/kb000001/download`

### Why this rule

- The URL does not depend on title wording.
- The URL does not depend on Quartz or Omeka path structure.
- The URL does not expose implementation details like `/item/847`.
- The bibliographic record remains stable even if the file becomes private or is replaced.

## What must not be canonical

These may exist internally or as redirects, but should not be the long-term public identifier:

- Omeka numeric item URLs such as `/item/10`
- title-only slug URLs
- paths with platform names like `/omeka/`, `/quartz/`, `/new/`
- file extensions like `.html` or `.php`
- workflow status markers such as `draft`, `review`, or `latest`

## Redirect rule

Every known legacy bibliography URL should redirect to the canonical Kaanu item URL.

### Redirect policy

- Use `301` redirects when cutover is final.
- Build redirects from the migration ledger, not ad hoc in server config.
- Redirect from old Quartz title pages to `https://kaanu.org/bib/{kaanu_id}`.
- Do not redirect directly to raw PDF URLs.

### If an item is merged

- old `kaanu_id` redirects to the surviving canonical `kaanu_id`
- legacy Quartz URLs for both records redirect to the surviving canonical record

## Canonical metadata rule

Each item should eventually carry these core fields:

- `kaanu_id`
- canonical item URL
- canonical PDF URL if public
- canonical DOI (Zenodo-minted), held in `bibo:doi`
- pre-existing publisher DOI(s) for cross-reference, held in `kaanu:otherDoi`
- legacy source path or URL
- Zotero bridge identifier
- Omeka internal item ID
- PDF rights status

## Required ledger columns

The migration ledger should now track the following minimum fields:

- `kaanu_id`
- `canonical_item_url`
- `canonical_pdf_url`
- `kaanu_doi` (the Zenodo-minted DOI, populated after the Phase 2D-4 mint pass)
- `other_doi` (any pre-existing publisher DOI, semicolon-separated if more than one)
- `omeka_item_id`
- `zotero_bridge_identifier`
- `legacy_path_or_url`
- `legacy_rel_path`
- `legacy_title`
- `year_guess`
- `source_type`
- `pdf_present`
- `pdf_url`
- `pdf_rights_status`
- `public_file_allowed`
- `original_source_url`
- `candidate_zotero_item`
- `import_status`
- `redirect_needed`
- `redirect_target_url`
- `duplicate_group`
- `notes`

The template at `migration/templates/migration_ledger_template.csv` has been expanded to reflect this.

## DOI policy

Every Kaanu record receives a Zenodo-minted DOI as its canonical DOI. Pre-existing publisher DOIs (CrossRef, DataCite-elsewhere) are not used as the canonical Kaanu DOI; they are captured separately for cross-reference.

### Two fields, two roles

- `bibo:doi` is the canonical Kaanu DOI, minted by Zenodo on deposit. Single value per record. Populated by the Phase 2D-4 mint pass and on every new accession thereafter.
- `kaanu:otherDoi` is multivalued. Holds any pre-existing publisher DOI, in DOI-name form (`10.NNNN/...`). Empty for records without a prior DOI.

### Order of operations

1. `record_other_dois.py` runs first on any record set that has been imported from Zotero or other sources. It pattern-matches DOI strings in `dcterms:source`, `dcterms:identifier`, `dcterms:bibliographicCitation`, and any imported Zotero DOI field, normalises them, and writes them to `kaanu:otherDoi`.
2. `mint_zenodo_dois.py` then deposits each record into the Kaanu community on Zenodo and writes the minted DataCite DOI back to `bibo:doi`.

### Zenodo fair-usage caveat

Zenodo has a fair-usage policy for bulk deposit. The relevant red flags for a project of Kaanu's shape are: dividing a single dataset into many records to circumvent upload limits, uploading very large numbers of records independent of data volume, and uploading content where the main purpose is indexing or archiving or promotion. Kaanu is a curated bibliographic archive at the scale of around 2,000 records. Before the first bulk run, write to Zenodo for an upfront agreement on the use case.

### Editor backstop

If Zenodo declines records that already have a publisher DOI, those records keep their existing DOI in `bibo:doi` and `kaanu:otherDoi` is left empty for that record. The canonical-DOI rule still holds: every Kaanu record has exactly one `bibo:doi`.

### Display rule

The item page shows the canonical DOI (`bibo:doi`) on the headline citation line. If `kaanu:otherDoi` is populated, a "Publisher DOI" line appears below it. The user-visible distinction is "this is Kaanu's DOI" versus "this DOI was assigned by the original publisher".

## Editorial workflow

For each incoming or migrated record:

1. Create or confirm the ledger row.
2. Assign a `kaanu_id`.
3. Set the canonical item URL from the `kaanu_id`.
4. Decide whether the file is:
    - metadata only
    - public PDF allowed
    - private/off-platform
5. Clean the metadata in Zotero.
6. Import into Omeka.
7. Confirm the Omeka item is mapped back to the ledger row.
8. Run `record_other_dois.py` to capture any pre-existing publisher DOI into `kaanu:otherDoi`.
9. Run `mint_zenodo_dois.py` to mint and store the canonical DOI in `bibo:doi`.
10. Add redirect coverage for any known legacy URL.

## PDF policy

The item page is the permanent object of record.

The PDF is only one representation of that object.

This means:

- if a PDF is public, expose it at `.../download`
- if a PDF later needs to be withdrawn, keep the item URL alive
- if a better file replaces the original, keep the item URL unchanged

## Batch import policy

Do not run the migration as:

- metadata first by one process
- PDFs later by manual cleanup

Instead, aim for one repeatable batch pipeline:

- cleaned metadata CSV
- encoded PDF URL where allowed
- Omeka import in controlled waves

Recommended wave size after pilot validation:

- `50` to `150` records per run

## Search and indexing policy

To avoid indexing problems:

- expose only one canonical public item URL per record
- add canonical tags to public item pages at final domain cutover
- keep staging domains out of indexing where appropriate
- generate sitemap entries from canonical item URLs only
- keep redirects stable and permanent

## Rolling notes

### 2026-04-25

- Adopted Zenodo-for-all DOI strategy: every Kaanu record receives a Zenodo-minted DOI in `bibo:doi`
- Added `kaanu:otherDoi` to the Kaanu vocabulary (literal, multivalued) for any pre-existing publisher DOI
- Added two scripts to the migration toolkit: `record_other_dois.py` (captures pre-existing DOIs) and `mint_zenodo_dois.py` (mints canonical Zenodo DOI and writes back to `bibo:doi`)
- Removed the earlier three-tier DOI plan (existing then CrossRef then Zenodo); CrossRef enrichment is no longer in scope
- Added Zenodo fair-usage caveat: write to Zenodo for an upfront agreement before the first bulk run
- Editor backstop documented: if Zenodo declines records with existing publisher DOIs, those keep their existing DOI in `bibo:doi`
- Expanded migration ledger to include `kaanu_doi` and `other_doi` columns

### 2026-04-19

- Adopted permanent Kaanu bibliographic identifier format: `kb000001`
- Adopted canonical item URL pattern: `https://kaanu.org/bib/{kaanu_id}`
- Adopted canonical PDF URL pattern: `https://kaanu.org/bib/{kaanu_id}/download`
- Expanded migration ledger template to include `kaanu_id`, canonical URLs, rights fields, and redirect target
- Agreed that title-slug URLs may exist as aliases later, but must not be canonical