# Kaanu: Migrating the existing Bibliography from Quartz to Omeka S

Goal: move every current bibliography entry on kaanu.daktre.com into the Omeka S archive, with clean Dublin Core metadata, preserved annotations, and attached PDFs where rights permit. Establish Zotero as the permanent staging area going forward, so the migration is also the start of the ongoing workflow, not a one-off job.

This walkthrough covers both kinds of existing entries (WIKINDX-derived and hand-written markdown with linked PDFs) and is meant to be worked through in order. Decision points are flagged where you'll need to tell me something about your data before the next step becomes concrete.

---

## 1. Inventory: what are you actually migrating?

Before any migration, count and classify. This prevents surprises in the middle.

### 1.1 Walk the Quartz repo

Clone the repo locally (or work on the server where it lives). From the repo root:

```bash
# Find every markdown file under the bibliography section
find content -path '*bibliograph*' -name '*.md' | wc -l
# Total count of bibliography pages

# List filenames
find content -path '*bibliograph*' -name '*.md' | sort

# Look for PDF links
grep -rn '\.pdf' content/ | grep -i bibliograph | head -50

# Spot the WIKINDX-exported files (they usually have a distinctive header)
grep -rln 'wikindx\|WIKINDX\|ID:' content/ | head -20
```

Adjust the `bibliograph` path to match your actual directory structure.

### 1.2 Classify

Put every entry into one of three buckets:

- **A: WIKINDX-exported.** Came from a WIKINDX export. Likely has a machine-looking header and a consistent structure.
- **B: Hand-written with attached PDF.** Someone wrote the entry as prose in markdown, linked a PDF that was uploaded to the Quartz repo.
- **C: Hand-written, no PDF.** Entry is a write-up or annotation with no file attachment.

Rough count of each. This decides which migration path dominates and whether scripting is worth the setup cost.

### 1.3 Decision points from the inventory

- **If there are under 50 entries total:** manual re-entry into Zotero is realistic and probably fastest. Scripting wouldn't pay back.
- **If 50 to 200:** light scripting for the consistent entries (A, and B if the markdown has a consistent shape), manual for the rest.
- **If over 200:** invest in a proper script, especially for B.

If you can paste the output of the `find` above plus one example file from each of A, B, and C, I can tailor the next sections to what you actually have.

---

## 2. Migration approach at a glance

Three stages, one shared destination:

```
    WIKINDX exports ──┐
                      ├──► Zotero (Kaanu group library) ──► Omeka S
    Markdown entries ─┘
```

Zotero as the middle ring does three useful things:

- Deduplicates. Entries may exist in both WIKINDX and markdown forms.
- Cleans metadata. Zotero's UI is faster for fixing authors, dates, and publication details than either raw CSV editing or Omeka S's admin form.
- Establishes the going-forward workflow. Every future bibliography addition flows through Zotero anyway, per the pipeline document. The migration is also the dress rehearsal for that pipeline.

Omeka S pulls from Zotero via the Zotero Import module (supported, field-mapped to Dublin Core, dedupe-aware).

---

## 3. Path A: WIKINDX-exported entries

### 3.1 If you still have access to the WIKINDX database

This is the cleanest case. Re-export fresh, don't try to reverse-engineer the current markdown.

WIKINDX can export to:

- **BibTeX** (best for Zotero): Tools → Exports → BibTeX
- **RIS** (also good for Zotero)
- **Endnote**, **MODS**, and others

Export to BibTeX. In Zotero desktop:

1. Open the Kaanu group library
2. File → Import
3. Choose the `.bib` file
4. Zotero creates a collection with all imported items

Verify a handful of entries look right. Authors, titles, dates, abstracts should populate. Tags may not carry over; you'll add those during cleanup in Section 5.

### 3.2 If the WIKINDX database is no longer accessible

You only have the rendered markdown pages on the Quartz site. Treat these the same way as Path B (Section 4). The fact that they came from WIKINDX originally doesn't help; what matters now is the markdown form they're in.

### 3.3 If you have a CSV export lying around from an earlier WIKINDX-to-Quartz pipeline

Great, that's usable too. Zotero can import CSV if you use the add-on **ZotFile** or via a light intermediate conversion. Simplest: open the CSV, check field names match BibTeX fields (author, title, year, journal, abstract, etc.), and convert using a small Python script:

```python
# csv_to_bibtex.py
import csv, sys

def esc(s):
    return str(s).replace('{', '').replace('}', '').strip()

rows = list(csv.DictReader(open(sys.argv[1])))
for i, r in enumerate(rows, 1):
    key = f"item{i}"
    print(f"@article{{{key},")
    if r.get('author'):  print(f"  author = {{{esc(r['author'])}}},")
    if r.get('title'):   print(f"  title  = {{{esc(r['title'])}}},")
    if r.get('year'):    print(f"  year   = {{{esc(r['year'])}}},")
    if r.get('journal'): print(f"  journal= {{{esc(r['journal'])}}},")
    if r.get('abstract'):print(f"  abstract={{{esc(r['abstract'])}}},")
    print("}")
```

Run: `python3 csv_to_bibtex.py wikindx.csv > wikindx.bib`, then import `wikindx.bib` into Zotero.

---

## 4. Path B: Hand-written markdown entries with linked PDFs

This is the trickier path because the structure may be inconsistent. Two approaches depending on volume.

### 4.1 For small numbers (under 50), the fastest route is PDF-driven

For each entry:

1. Find the PDF file in the Quartz repo (usually under `static/` or similar).
2. Drag it into the Kaanu Zotero group library.
3. In Zotero, right-click the item and choose **Retrieve Metadata for PDF**. Zotero queries Google Scholar and publisher APIs; most academic PDFs auto-populate.
4. If retrieval fails or is wrong, fill the metadata fields by hand from the original markdown entry.
5. Copy the annotation text (the human-written part of the markdown entry) into the Zotero item's **Notes** field.

Zotero's PDF metadata retrieval has a hit rate of maybe 70 to 90 percent for published materials; for reports, theses, and grey literature it falls off. For those, manual entry is faster than fighting the tool.

### 4.2 For larger numbers, parse the markdown

If the markdown entries follow a consistent shape (frontmatter with structured fields, or a predictable body format), parse them with a script into BibTeX and import in bulk.

Example: if your markdown looks like this,

```markdown
---
title: "Sacred Groves and Livelihoods in the Western Ghats"
author: "Smith, Jane; Iyer, Ravi"
year: 2015
type: article
journal: "Ecology and Society"
pdf: "/static/pdfs/smith-iyer-2015.pdf"
tags: [forest rights, Soliga]
---

This article examines the interplay between sacred groves and community livelihoods...
```

then a small Python script pulls the frontmatter and body:

```python
# md_to_bibtex.py
import sys, os, frontmatter   # pip install python-frontmatter

def bib_escape(s):
    return str(s).replace('{', '').replace('}', '').strip()

def item_to_bibtex(path, i):
    post = frontmatter.load(path)
    m = post.metadata
    slug = os.path.splitext(os.path.basename(path))[0]
    etype = m.get('type', 'article')
    lines = [f"@{etype}{{{slug},"]
    if m.get('author'):
        lines.append(f"  author   = {{{bib_escape(m['author'])}}},")
    if m.get('title'):
        lines.append(f"  title    = {{{bib_escape(m['title'])}}},")
    if m.get('year'):
        lines.append(f"  year     = {{{bib_escape(m['year'])}}},")
    if m.get('journal'):
        lines.append(f"  journal  = {{{bib_escape(m['journal'])}}},")
    if m.get('tags'):
        tags = m['tags'] if isinstance(m['tags'], list) else [m['tags']]
        lines.append(f"  keywords = {{{', '.join(bib_escape(t) for t in tags)}}},")
    if post.content:
        first_para = post.content.strip().split('\n\n')[0]
        lines.append(f"  abstract = {{{bib_escape(first_para)}}},")
    if m.get('pdf'):
        lines.append(f"  note     = {{PDF: {bib_escape(m['pdf'])}}},")
    lines.append("}")
    return "\n".join(lines)

for i, path in enumerate(sys.argv[1:], 1):
    print(item_to_bibtex(path, i))
    print()
```

Run: `python3 md_to_bibtex.py content/bibliography/*.md > markdown-bib.bib`, then import into Zotero.

If your markdown doesn't have frontmatter, adjust the script to regex-parse the body. Paste one example file for me and I'll tailor it.

### 4.3 Handling the PDFs in Path B

The script above just records the PDF path in a note field. To actually attach the PDF to the Zotero item, do one of:

- **After import, drag each PDF onto its matching Zotero item** (manual, fast for small numbers)
- **Use Zotero's command-line add** via `zotero-cli` or the RDF import with attachment paths (more setup, worth it for >100)
- **Skip PDFs in Zotero, attach them directly in Omeka S after import** (simpler, see Section 7)

For a first migration, option 3 is cleanest. Zotero holds the metadata and annotation; Omeka S gets the PDF attached during or after the Zotero-to-Omeka sync.

---

## 5. Consolidate in Zotero

Once both paths have flowed in, everything sits in the Kaanu Zotero group library, possibly in two separate collections (`From WIKINDX`, `From Markdown`). Now clean up.

### 5.1 Deduplicate

Zotero has a built-in duplicate finder: **Edit → Preferences → General → Duplicate Items**. Or in the library sidebar: **Duplicate Items**. Merge duplicates, preserving the richer record.

### 5.2 Standardise authors and titles

Common fixes:

- "Smith, J." vs "Smith, Jane" vs "Jane Smith": pick one form and apply
- Title case vs sentence case: Zotero has a right-click → **Transform Text** option per item
- Date: every item should have at least a year. Partial dates (year only) are fine.

### 5.3 Apply Kaanu tags

Use the controlled vocabulary from the main plan. For every item, add at minimum:

- One subject tag (forest rights, ethnobotany, language, etc.)
- One community tag where applicable (Soliga, Jenu Kuruba, etc.)
- One region tag (BR Hills, Western Ghats, etc.)
- An era tag (colonial, post-Independence, post-FRA, etc.)

Zotero tags are multi-select and autocomplete, so this is faster than it sounds once the vocabulary is in use.

### 5.4 Move annotations into a consistent place

If annotations currently live in the markdown body, move them into the Zotero item's **Notes** field (or into **Abstract** if they're abstract-like). Decide on a convention:

- Abstract field: short description or abstract from the original publisher
- Notes field: Kaanu's scholarly annotation

Be consistent, because the Zotero Import module will map these fields predictably into Dublin Core.

### 5.5 Mark items as ready

Add a Zotero tag `status:ready-for-archive` to every item that's clean enough to migrate. Items missing this tag won't be pulled into Omeka S, which gives you a review gate.

---

## 6. Move into Omeka S

Two ways; I recommend doing a CSV trial first and then switching to the Zotero Import module for the ongoing pipeline.

### 6.1 Trial: CSV Import (first small batch)

In Zotero, select 10 to 20 items that are well-cleaned. Right-click, **Export Items**, choose format: **CSV**. Save.

In Omeka S admin (the trial install at kaanu-test.daktre.com):

1. **Modules → CSV Import → Import**
2. Upload the CSV
3. Map columns to Dublin Core fields:
   - Title → `dcterms:title`
   - Creator/Author → `dcterms:creator`
   - Date → `dcterms:date`
   - Abstract Note → `dcterms:description`
   - Tags (Manual) → `dcterms:subject`
   - Rights → `dcterms:rights`
   - URL → `dcterms:identifier` or `bibo:uri`
   - Item Type → `dcterms:type`
4. Set resource template: `BibliographicItem` (if you've created one) or leave default
5. Set item class: `bibo:Book`, `bibo:Article`, etc. based on the CSV's Item Type column
6. Run the import
7. Review the imported items; fix mapping if anything came across wrong

The point of doing a small batch first is to catch mapping issues before you're 200 items deep into a bad schema.

### 6.2 Production: Zotero Import module (ongoing)

Once the mapping is right, switch to live Zotero sync:

1. In Omeka S, install the Zotero Import module (from https://gitlab.com/Daniel-KM/Omeka-S-module-ZoteroImport or the omeka.org modules page). Copy into `/var/www/kaanu-omeka/modules/`, activate in admin.
2. Generate a Zotero API key: https://www.zotero.org/settings/keys → Create new private key → give it read access to the Kaanu group library. Copy the key.
3. Find the Kaanu Zotero group's numeric ID: in Zotero web, navigate to the group; the URL ends with `/groups/<id>`.
4. In Omeka S: **Modules → Zotero Import → Import**
5. Enter the group ID and API key. Choose the collection to import (or the whole library). Choose which items to pull (all, or only those with the `status:ready-for-archive` tag).
6. Configure field mapping (the module provides sensible defaults).
7. Run import. The module tracks which Zotero items have already been imported (by Zotero item key), so subsequent runs only bring in new or changed items.

This can be scheduled as a cron job for ongoing sync, or run manually after each batch of Zotero additions. For Kaanu's volume, manual + weekly is plenty.

---

## 7. Attach PDFs

PDFs need to move from the Quartz static directory into Omeka S, as media attached to the matching items.

### 7.1 Rights triage first

For each PDF, decide:

- **Redistributable**: upload to Omeka S as a media item attached to the record.
- **Link-out only**: keep metadata in Omeka S, don't upload the PDF. Instead, use the `dcterms:identifier` or `bibo:uri` field to hold the canonical URL where the PDF can be accessed (publisher site, institutional repository, etc.).
- **Private / member-only**: upload but set visibility to `is_public = false`. Only logged-in members will see the file.
- **Unknown**: default to metadata-only until rights are clarified.

### 7.2 Bulk PDF attachment

The CSV Import module has a `Media` column that takes a file path on the server. To use it:

1. Copy all redistributable PDFs to a directory the Omeka S user can read:
   ```bash
   sudo mkdir -p /var/www/kaanu-omeka/incoming-pdfs
   sudo cp /path/to/quartz/static/pdfs/*.pdf /var/www/kaanu-omeka/incoming-pdfs/
   sudo chown -R www-data:www-data /var/www/kaanu-omeka/incoming-pdfs
   ```
2. Add a column to your Zotero CSV export: `Media` with the absolute path to each PDF.
3. In CSV Import, map the `Media` column as a file attachment.
4. Import. Each item gets its PDF attached.

Alternative: attach PDFs individually in the Omeka S admin. Fine for small numbers, tedious for hundreds.

---

## 8. Verify

Random-sample verification. Pick 10 items spanning different types (a journal article, a book, a thesis, a report, an edited volume entry). For each, check:

- Title, author, date match the original
- Abstract/description is present and correct
- Tags map to Kaanu's controlled vocabulary
- If a PDF was attached, it opens
- The item's public URL is reachable: `https://kaanu-test.daktre.com/s/kaanu/item/<id>`
- Searching for a distinctive phrase from the title finds it

Spot checks on metadata across the whole collection:

```sql
-- Logged into the Omeka S MySQL DB
USE omeka_s;

-- Items with no title (should be zero)
SELECT COUNT(*) FROM resource r 
  LEFT JOIN value v ON v.resource_id = r.id AND v.property_id = (
    SELECT id FROM property WHERE local_name = 'title' AND vocabulary_id = (
      SELECT id FROM vocabulary WHERE prefix = 'dcterms'
    )
  ) 
  WHERE r.resource_type = 'Omeka\\Entity\\Item' AND v.id IS NULL;

-- Items with no creator
-- (same pattern, replace 'title' with 'creator')

-- Items with no date
-- (same pattern, 'date')

-- Items with no subject tag
-- (same pattern, 'subject')
```

Any non-zero count is a cleanup task. Fix in Zotero, re-import, or fix directly in Omeka S.

---

## 9. Redirects: keep existing links working

Every old Quartz bibliography URL that's indexed by search engines or linked from elsewhere should redirect to the new Omeka S item URL.

### 9.1 Build a redirect map

For each migrated item, record two things:

- Old Quartz URL (e.g., `/bibliography/smith-iyer-2015-sacred-groves/`)
- New Omeka S URL (e.g., `/s/kaanu/item/42`)

A simple CSV with two columns. Populate it during migration (the Zotero Import module can record the original URL in a custom field if you add one to the mapping).

### 9.2 nginx redirect block

Once the trial is looking good and you migrate kaanu.daktre.com to Omeka S, add the redirects to the nginx vhost:

```nginx
server {
    # ... existing config ...

    # Bibliography redirects from old Quartz paths
    location = /bibliography/smith-iyer-2015-sacred-groves/ {
        return 301 /s/kaanu/item/42;
    }
    # ... repeat per migrated item
}
```

For large redirect maps (hundreds), use nginx's `map` directive instead of per-location blocks:

```nginx
map $request_uri $new_uri {
    default "";
    /bibliography/smith-iyer-2015-sacred-groves/  /s/kaanu/item/42;
    /bibliography/kumar-2018-forest-rights/       /s/kaanu/item/43;
    # ... rest of mappings
}

server {
    # ... existing config ...
    
    if ($new_uri != "") {
        return 301 $new_uri;
    }
}
```

### 9.3 Retire the Quartz Bibliography pages

Once redirects are in place and verified, remove the old markdown files from the Quartz repo. Replace the index page with a short note: "The Kaanu Bibliography is now the Kaanu Archive at [link]".

---

## 10. Questions to sharpen this

To turn this walkthrough into specific commands and scripts for your case, these answers would help:

1. **Roughly how many bibliography entries exist today?** (From Section 1's `find` command.)
2. **Is the WIKINDX database still accessible somewhere?** If yes, re-exporting is the easy path. If no, we work from the markdown.
3. **Do the markdown entries have YAML frontmatter, or are they prose with metadata inline?** Paste one example of each kind you have.
4. **Where do the PDFs currently live?** Static directory in the Quartz repo? Separate upload folder? Offsite?
5. **Do you have a Zotero account already?** If not, create one, create a new group library named "Kaanu Collection", and add yourself as an admin.

With those answers the scripts and commands in Sections 3, 4, and 7 can be tuned precisely. Without them, the outlines above are enough to start the cleanup and trial import.

---

## 11. Suggested order of operations

If all of this looks like too much at once, here's the order I'd actually do it:

1. **Do the inventory in Section 1.** Count what's there. (30 min)
2. **Create the Zotero group library.** (5 min)
3. **Export WIKINDX to BibTeX, import to Zotero.** Check that 10 random items look right. (1 hour)
4. **Pick 10 hand-written markdown entries and re-enter them manually into Zotero**, via PDF drag-and-drop or direct entry. Gets a feel for the time per item. (1 hour)
5. **Decide from that: full manual re-entry, or invest in a parsing script for the rest.** (Decision gate.)
6. **Complete the Zotero side.** Clean tags, annotations, dedupe. (Days, depending on volume.)
7. **Install the Zotero Import module in the trial Omeka S.** (30 min)
8. **First Omeka S import: 10 items via CSV.** Check the Dublin Core mapping end-to-end. (30 min)
9. **Full Zotero-to-Omeka sync.** (1 hour, then verify over a few days.)
10. **Attach PDFs.** (Variable, rights-dependent.)
11. **Write redirects, retire old Quartz pages.** (Depends on when you migrate kaanu.daktre.com itself.)

The cadence is: do things in small batches, verify at each gate, keep Zotero clean, keep the Omeka S import idempotent so re-running is safe.
