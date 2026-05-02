
**Date:** May 2, 2026 **Status:** Operational with 1966 items imported **Previous phase:** 5-item pilot (May 1, 2026)

AI summary of today's work

---

## What Was Accomplished (May 2, 2026)

### Full Import Pipeline: 1966 Items

1. **Metadata extraction** from 1966 PDFs using `extract.py` logic (adapted from github.com/asdofindia/kaanu-code). Extracted keywords (1198 items with keywords, 768 without) and original source URLs from PDF metadata and annotations.
    
2. **Metadata enrichment** via CrossRef API. Of 1966 records: 56 DOIs extracted from publisher URLs, 440 CrossRef lookups attempted, 212 successful matches returning full bibliographic metadata (journal, volume, pages, abstract, authors, ISSN).
    
3. **Item type classification:**
    
    - Documents (grey literature, books, unclassified): 1474
    - Newspaper/media articles: 207
    - Journal articles: 197
    - Government/institutional reports: 73
    - Book chapters: 11
    - Monographs: 2
    - Other: 2
4. **Import into Omeka S** via API. All 1966 items created with Dublin Core metadata (title, creator, date, subject keywords, source URL, DOI, publisher, abstract, citation, hasFormat link to PDF) and assigned to the "Kaanu" item set (ID: 7).
    
5. **Kaanu identifiers assigned:** kb000001 through kb001966 stored as `kaanu:identifier` (property ID 185).
    
6. **CleanUrl configured and working:** `archive.kaanu.org/bib/kb000001` resolves correctly.
    
7. **Stable URI routing working:** `kaanu.org/bib/kb000001` redirects to `archive.kaanu.org/bib/kb000001`.
    
8. **PDFs served via nginx:** all 1966 PDFs accessible at `archive.kaanu.org/files/{filename}.pdf` from `/home/daktre/SIAKC RefCo/`.
    

---

## Current State

### Infrastructure

- **Server:** GoDaddy VPS
- **Domain:** archive.kaanu.org (SSL via SAN cert from new.kaanu.org)
- **Omeka S:** v4.2.0 at `/var/www/omeka`
- **Database:** MySQL 8.0 (host=localhost)
- **PHP:** 8.3.6-FPM, nginx 1.24.0

### Omeka Configuration

- **Site:** Kaanu (slug: kaanu)
- **Modules installed:** Common (3.4.84), CleanUrl (3.17.12), FileSideload, ZoteroImport
- **Kaanu vocabulary:** registered (prefix: kaanu, namespace: https://kaanu.org/ns/)
- **Properties:** kaanu:identifier (ID 185), kaanu:otherDoi (ID 186)
- **Item set:** Kaanu (ID: 7), containing all 1966 items
- **API key:** configured (credentials stored separately, not in this document)

### URL Structure

- **Stable public URI:** `https://kaanu.org/bib/kb000001` (redirects via nginx rewrite)
- **Archive display:** `https://archive.kaanu.org/bib/kb000001` (resolved by CleanUrl)
- **PDF access:** `https://archive.kaanu.org/files/{url-encoded-filename}.pdf`
- **Item browse:** `https://archive.kaanu.org/s/kaanu/item`

### Server Layout

|Item|Path|
|---|---|
|Omeka root|`/var/www/omeka/`|
|CleanUrl config|`/var/www/omeka/config/cleanurl.config.php`|
|Nginx config|`/etc/nginx/sites-available/kaanu`|
|SSL certs|`/etc/letsencrypt/live/new.kaanu.org/`|
|PDF files|`/home/daktre/SIAKC RefCo/`|
|Import scripts|`/home/daktre/kaanu-code/`|

### Import Scripts (at /home/daktre/kaanu-code/)

|Script|Purpose|
|---|---|
|`01_extract_all.py`|Extract keywords and source URLs from all PDFs|
|`02_enrich.py`|Parse filenames, CrossRef/DOI lookup, spelling corrections|
|`03_import_to_omeka.py`|Push items to Omeka S API with kb-identifiers|
|`fix_kaanu_ids.py`|Add kaanu:identifier via full PUT (not PATCH)|
|`extract.py`|Original single-PDF extractor (from asdofindia/kaanu-code)|
|`publish.py`|Original Quartz site generator (from asdofindia/kaanu-code)|
|`download-check.py`|Original PDF sync checker (from asdofindia/kaanu-code)|

### Data Files (at /home/daktre/kaanu-code/)

|File|Contents|
|---|---|
|`output.csv`|Phase 1 extraction: filename, keywords, source URL for all 1966 PDFs|
|`enriched.json`|Phase 2 enrichment: full parsed metadata with CrossRef data|
|`import_log.csv`|Phase 3 import log: filename, title, status, Omeka item ID|

---

## Database Essentials

**Connection:**

```bash
mysql -u omeka -p omeka
```

**Key queries:**

```sql
-- Count all items
SELECT COUNT(*) FROM resource WHERE resource_type='Omeka\\Entity\\Item';

-- Count items with kaanu:identifier
SELECT COUNT(*) FROM value WHERE property_id=185;

-- Check a specific identifier
SELECT r.id, v.value FROM value v
JOIN resource r ON v.resource_id=r.id
WHERE v.property_id=185 AND v.value='kb000001';

-- Count items with keywords
SELECT COUNT(DISTINCT resource_id) FROM value WHERE property_id=3;
```

---

## Key Technical Decisions

### Architecture

- **Direct import to Omeka S** rather than routing through Zotero. The enrichment pipeline (CrossRef lookup, filename parsing, keyword extraction) runs as standalone Python scripts, removing the dependency on Zotero as an intermediary.
- **PDFs served by nginx** from their existing location rather than uploaded into Omeka's file store. This avoids duplicating 1966 PDFs and keeps the import fast. Items link to PDFs via `dcterms:hasFormat`.
- **gpura.org as the display model:** item pages show structured metadata with a "Download PDF" link, keywords as clickable search terms.

### What worked

- CrossRef API (polite pool with email header) for enriching DOI-bearing items
- Filename convention parsing (`{Topic} {Year} {Author(s)}.pdf`) for baseline metadata
- Spelling corrections dictionary from publish.py for keyword normalisation
- Omeka S API for bulk item creation (1966 items, zero errors)
- PUT (not PATCH) for adding kaanu:identifier without losing existing properties

### What didn't work

- **PATCH for adding properties:** Omeka S PATCH replaces all properties with what you send, silently dropping existing ones. Use PUT with the full item data instead.
- **JSTOR stable IDs as DOIs:** `10.2307/xxxxx` identifiers are not reliably indexed in CrossRef. Fall through to title search instead.
- **CrossRef title search for niche literature:** South Asian social science, Adivasi studies, and grey literature have poor CrossRef coverage. Score threshold lowered to 25 but many items still don't match.
- **CleanUrl "skip site slug":** Causes routing errors with Omeka S 4.2.0. Keep site slug in Omeka internal URLs; use nginx rewrite from kaanu.org for clean public URIs.
- **cleanurl.config.php:** Must be valid PHP. The SETTINGS constant must be a quoted string, not raw JSON.

---

## Still To Do

### High Priority

- **Theme customisation:** Adapt the Omeka S theme to display items like gpura.org (Download PDF button at top, structured metadata table, clickable keyword search links, abstract display)
- **Search indexing:** Install/configure search module and build full-text index
- **Fork kaanu-code to github.com/daktre:** Add the new import scripts (01/02/03 + fix_kaanu_ids.py) alongside the originals

### Medium Priority

- **Keyword gap:** 768 items have no keywords. Create a review list for future tagging
- **Restore assign_kaanu_ids.py:** File was accidentally corrupted during the session; needs recreation
- **bibo:uri values:** The pilot used bibo:uri for stable URIs but the full import uses kaanu.org/bib/ nginx redirects instead. Decide if bibo:uri should also be populated for semantic completeness

### Low Priority

- **PDF attachment via FileSideload:** Currently PDFs are linked externally via dcterms:hasFormat. Could alternatively attach as Omeka media for native PDF viewer (like gpura.org). This would require copying all PDFs into Omeka's sideload directory and running intake jobs.
- **Faceted browse:** Configure faceted browse by keyword, year, item type, publisher
- **kaanu:otherDoi:** Populate for items where the DOI was found via CrossRef but not in the original source URL

---

## Lessons Learned

1. **Omeka S PATCH is destructive.** It replaces all properties, not just the ones you send. Always use PUT with full item data when adding a single property to existing items.
2. **cleanurl.config.php must be valid PHP.** JSON constants need to be wrapped in quotes as PHP strings.
3. **nohup is essential for long-running server tasks.** SSH disconnections will kill running processes without it.
4. **CrossRef coverage varies enormously.** Academic publishers (SAGE, Wiley, T&F, Springer) are well indexed. Indian social science journals, grey literature, and books from smaller publishers are not.
5. **Filename conventions are a reliable metadata source.** The `{Topic} {Year} {Author(s)}.pdf` pattern provides baseline title, year, and author even when no other metadata exists.
6. **nginx permissions matter.** The www-data user needs read+execute on the PDF directory and all parent directories.
7. **Test with small batches first.** The 5-item and 10-item test runs caught multiple issues before they affected 1966 items.

---

