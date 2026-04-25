# Kaanu Full Pilot 10: Architecture Prep Brief

**Date:** 2026-04-25
**Scope:** bring the current 10-item pilot up to the full Phase 2A architecture described in `KAANU_PHASE_2_PLAN.md`, so the pilot behaves like the intended public Kaanu archive stack rather than a provisional Omeka browse.

## 1. What this prep brief is for

The current Kaanu documentation now describes a much more complete public architecture than what is actually live on the droplet.

This brief converts that documentation into an implementation-ready sequence for the 10 pilot records.

The goal is not simply "make the 10 items visible." They are already visible.

The goal is to make the 10 items behave as the real Kaanu archive is supposed to behave:

- archive served on `archive.kaanu.org`
- canonical stable URLs on `kaanu.org/bib/{kaanu_id}`
- Omeka item pages with Stable URL, DOI lines, download behavior, and media rendering
- Kaanu vocabulary present in Omeka
- the identifier layer actually assigned on the pilot items
- the full public-facing architecture exercised end to end before the 843-item migration

## 2. Latest documented target

Per:

- `KAANU_PHASE_2_PLAN.md`
- `DOCUMENTATION.md`
- the staging-page note at `https://kaanu.daktre.com/In-Curation/Kaanu-phase-2-staging-page`

The intended Phase 2 pilot architecture is:

1. `kaanu.org`
   - static home site
   - future blog, charter, events
   - canonical public stable URL layer under `/bib/{kaanu_id}`
2. `archive.kaanu.org`
   - Omeka S
   - search, browse, item pages, contribute
3. Identifier layer
   - `kaanu:identifier` = `kb000001`
   - `bibo:uri` = `https://kaanu.org/bib/kb000001`
   - later `bibo:doi`
   - later `kaanu:otherDoi`
4. URL resolution
   - Clean Url handles `/bib/{kaanu_id}` on Omeka
   - custom Kaanu module handles `/bib/{kaanu_id}/download`
   - `kaanu.org/bib/*` later proxies to `archive.kaanu.org/bib/*`
5. Pilot acceptance
   - 10 pilot items should work through this full stack before the bulk migration starts

## 3. Verified live state on 2026-04-25

These are not assumptions. They were checked directly against the running droplet and public endpoints.

### Domains

- `new.kaanu.org` is live and serving Omeka.
- `archive.kaanu.org` is **not** live yet.
- `kaanu.org` has **not** been cut over into the split architecture.

### Omeka application

- Omeka is running at `/var/www/omeka`.
- Active modules on disk and in DB:
  - `AdvancedResourceTemplate`
  - `Collecting`
  - `Common`
  - `Contribute`
  - `CSVImport`
  - `Mapper`
  - `Selection`
  - `ValueSuggest`
  - `ZoteroImport`
- Missing from live deployment:
  - `CleanUrl`
  - `FileSideload`
  - `Kaanu` custom module

### Content state

- Site exists: `kaanu`
- Public homepage exists
- Pilot items exist: `10`
- Media attached: `1`
- Public browse works on `new.kaanu.org`

### Metadata / identifier layer

- `bibo` vocabulary exists in Omeka
- `kaanu` vocabulary does **not** exist yet
- no `kaanu:identifier` values are present
- no `bibo:uri` stable URL layer has been written to items
- items still use Omeka-native paths and internal item ids

### Public item page behavior

- Current public pages use the default Omeka theme rendering
- no Stable URL line
- no DOI line
- no custom Download button
- no `/bib/{kaanu_id}` route
- no `/bib/{kaanu_id}/download` route
- Contribute warning still appears on item pages

## 4. Main gap between docs and reality

The documentation is describing the **target pilot**, not the **current deployment**.

In practical terms, the 10-item pilot is still in "Phase 0/early Phase 2A" condition:

- content exists
- one PDF attach proof exists
- site homepage has basic editorial copy

But the full architecture required for the real pilot has not been set up yet.

## 5. What must be true for the pilot to count as "full"

The 10-item pilot should only be considered fully representative once all of the following are true.

### A. Host / domain layer

- `archive.kaanu.org` resolves and serves the Omeka instance
- `new.kaanu.org` redirects to `archive.kaanu.org` or remains only as a temporary alias
- the plan for `kaanu.org/bib/*` proxying is ready, even if the full static home site is still minimal

### B. Data model layer

- Kaanu vocabulary registered in Omeka
- properties present:
  - `kaanu:identifier`
  - `kaanu:otherDoi`
- pilot items assigned:
  - `kb000001` through `kb000010`
- pilot items also carry:
  - `bibo:uri`

### C. URL layer

- `/bib/kb000001` style URLs resolve on Omeka
- native `/s/kaanu/item/{id}` URLs redirect to the identifier URL
- download route works for items with media

### D. Presentation layer

- custom item page layout with:
  - title and citation block
  - Stable URL line
  - DOI line placeholder or actual DOI logic
  - Download button
  - inline viewer behavior
  - metadata panel below

### E. Pilot content layer

- all 10 pilot items have their intended PDFs attached, or a deliberate metadata-only decision recorded
- public descriptions are clean
- workflow tags are not public-facing
- one About / Pilot explainer page exists

## 6. Recommended implementation order

This is the sequence that best matches the latest plan while minimizing wasted effort.

### Step 1. Domain and host prep

- Create DNS for `archive.kaanu.org`
- extend nginx `server_name`
- issue certificate
- verify Omeka serves correctly on `archive.kaanu.org`

Reason:

- The rest of the pilot should be verified on the intended archive host, not the temporary one.

### Step 2. Install missing Omeka modules

- install `CleanUrl`
- install `FileSideload`

Reason:

- Clean Url is required for `/bib/{kaanu_id}`
- File Sideload is the intended bulk PDF path for the larger migration

### Step 3. Register Kaanu vocabulary in Omeka

- add vocabulary:
  - label `Kaanu`
  - prefix `kaanu`
  - namespace `https://kaanu.org/ns/`
- add properties:
  - `identifier`
  - `otherDoi`

Reason:

- The full identifier layer cannot start until the vocabulary exists in Omeka itself.

### Step 4. Fix and verify ID assignment path

- update `assign_kaanu_ids.py` if needed for the current working API key/base URL
- dry run against one item
- live run against the 10 pilot items
- verify `kaanu:identifier` and `bibo:uri` write correctly

Reason:

- Stable URL behavior depends on these values existing first.

### Step 5. Install and configure Clean Url

- configure main path `bib`
- set identifier property to `kaanu:identifier`
- disable site slug in URL
- verify `/bib/kb000001` works
- verify native Omeka item URL redirect behavior

Reason:

- This establishes the canonical item URL structure before custom rendering work.

### Step 6. Build the Kaanu custom module

Minimum viable custom module for pilot:

- `/bib/{id}/download` route
- controller for download behavior
- theme/view override for item page rendering

Reason:

- This is where the Kaanu-specific public item page experience actually lives.

### Step 7. Bring all 10 pilot PDFs into place

- attach remaining pilot PDFs through a batch path
- verify viewer + download behavior
- record the one missing/unavailable file separately if still unresolved

Reason:

- The pilot only tests the real archive if the items behave as mixed metadata+PDF records, not just metadata shells.

### Step 8. Remove or suppress misleading public UI

- remove Contribute warning from item pages unless contribution is actually configured for this phase
- ensure process tags stay out of public subject display

Reason:

- The pilot should demonstrate intended public behavior, not implementation leftovers.

### Step 9. Prepare the static front door

- minimal `kaanu.org` placeholder or static signpost
- archive link
- pilot explanation
- future sections noted but not blocked on full content

Reason:

- Even if the full blog/events/charter stack is not ready, the domain split should be coherent during pilot review.

## 7. Recommended acceptance checks for the full pilot

These should all pass before moving from "prep" to "migration-ready pilot."

### URL and identifier

- `archive.kaanu.org/bib/kb000001` resolves
- all 10 records have unique `kaanu:identifier`
- all 10 records have `bibo:uri`
- Omeka native item URLs redirect to the identifier route

### Content and media

- all expected pilot PDFs attach successfully
- item with PDF displays viewer + download
- metadata-only item displays correctly without broken viewer

### Page rendering

- Stable URL line visible
- DOI line placeholder or canonical DOI logic visible
- metadata panel readable
- no stray admin/process messaging

### Public architecture

- `archive.kaanu.org` serves Omeka
- `kaanu.org` has a coherent public front page or staging equivalent
- `new.kaanu.org` is no longer treated as the canonical destination

## 8. Immediate blockers identified during prep

These are the concrete items that currently block the "full pilot" target:

- `archive.kaanu.org` does not resolve
- `CleanUrl` is not installed
- `FileSideload` is not installed
- custom `Kaanu` module does not exist on the server
- `kaanu` vocabulary is not present in Omeka
- stable identifier values are not assigned on the pilot items
- custom item-page rendering is not implemented
- only 1 of the 10 PDFs is attached

## 9. What is already in good shape

- the droplet and base Omeka install are live
- the pilot records exist
- one PDF attach proof already exists
- the migration scripts folder already contains the beginnings of the ID and pilot tooling
- the latest documentation is now much clearer and more internally consistent than before

## 10. Recommendation

Treat the next implementation pass as a strict Phase 2A completion sprint for the 10 pilot records.

Do **not** start the 843-item migration wave until the 10 pilot items are running with:

- real `kaanu:identifier`
- real `/bib/{id}` URLs
- real download route
- real PDF/media behavior
- real archive host separation

That is the point of the pilot.

## 11. Suggested next coding / ops tasks

In order:

1. DNS + nginx + TLS for `archive.kaanu.org`
2. install `CleanUrl` and `FileSideload`
3. register Kaanu vocabulary and properties
4. make `assign_kaanu_ids.py` work against the current live API key and run it on the 10 items
5. implement the Kaanu custom module
6. attach the remaining pilot PDFs in batch
7. verify routes, rendering, and redirects

