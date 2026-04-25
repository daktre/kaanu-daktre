
*Revised architecture. kaanu.org as a single integrated platform: landing page, Omeka S archive, and a Quartz-generated interconnectedness graph sitting on top of a shared data model. New droplet, clean start, no Manifold entanglement.*

## 1. What we are building
A single platform at `kaanu.org` with three visible components:

1. **Landing page** at `kaanu.org`. Explains the initiative, its charter, its three functions, and how to join. Entry point for members and casual visitors alike. Invites browse/search of colleciton. NO need of registration for this
2. **Archive** at `kaanu.org/archive` (Omeka S). The system of record. Every bibliographic item, PDF, multimedia file, community portrait, and exhibit lives here. Approved members add items through Omeka's native submission flow.
3. **Graph** at `kaanu.org/graph` (Quartz). A generated visualisation layer showing the interconnectedness of items via their shared keywords, communities, regions, eras, authors, and themes. Not separately authored. It is rebuilt from the Omeka data on a schedule, so it always reflects the current state of the archive.


This is not the earlier "two parallel systems" proposal. Quartz is no longer a separately-authored curator/atelier function. It is a read-only view generated from Omeka's API, whose job is to do the one thing Omeka cannot do natively: show the archive as a navigable graph of relationships. Also more in line with the digital garden/knowledge-base function. 

## 2. Why this works

The earlier dilemma was: Quartz is good at linked prose and graph feel; Omeka is good at structured archival records; keeping both as authoring systems doubles the maintenance load. The solution here sidesteps that dilemma entirely.

- Authoring happens in exactly one place (Omeka).
- The graph visualisation is derived.
- Members only need to learn one interface (Omeka) to contribute.
- Visitors get two ways to navigate the same material: faceted-archive style (Omeka) or graph-walk style (Quartz).
- If the Quartz layer ever breaks or falls out of favour, the archive is unaffected.

## 3. Architecture in one diagram

```
                      kaanu.org  (single domain, single droplet)
                              |
              ________________|_________________
             |                |                 |
      /  (root)          /archive            /graph
      Landing page        Omeka S            Quartz (static HTML)
      (static HTML)     (PHP + MariaDB)      Generated from Omeka API
             |                |                 |
             |                |           (rebuilt nightly or
             |                |            on-demand via webhook)
             |                |
      nginx reverse proxy / static server
                              |
                    MariaDB  +  PHP-FPM  +  cron
                              |
                         Object storage
                      (Backblaze B2 or S3)
                    for backups and heavy media
```

Everything above is on the **new droplet**, separate from the Manifold one (the one I have used for a test Manifold installation)

## 4. New droplet specification

A fresh DigitalOcean droplet so Manifold, Kaanu, and any future experiments stay isolated.

| Resource | Recommendation         | Rationale                                                                                 |
| -------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| vCPUs    | 2                      | Quartz rebuild is the only CPU spike; 2 handles it without affecting Omeka response times |
| RAM      | 4 GB                   | Omeka S + MariaDB + PHP-FPM + Quartz build process + nginx fits comfortably               |
| Disk     | 80 GB SSD              | Archive grows slowly; heavy multimedia goes to B2 not local disk                          |
| Region   | BLR1 (Bangalore)/India | Likely largely Ind audiences                                                              |
| OS       | Ubuntu 24.04 LTS       | Current LTS, supported till 2029                                                          |

Approximate cost: around USD 24/month (INR 2,000/month). We could start with the 2 GB/1 vCPU plan at half that price and upgrade later; Omeka runs on it, but Quartz builds will be slow and concurrent visitors will feel it.

## 5. The three components in detail

### 5.1 Landing page at `kaanu.org`

Purpose: explain the initiative, make the charter visible, signpost the archive and the graph, offer a path to membership.

Implementation: a static HTML page  Written once, edited rarely. HTML with a shared stylesheet that also theme-informs Omeka and Quartz, so the three feel like one site.

Contents:
- One-paragraph introduction to Kaanu
- Three tiles or cards: "Browse the archive", "Explore the graph", "Join as a member"
- Link to the charter (as a PDF or an Omeka Page) & sign-up for members
- Link to the centre information (Omeka Page)
- News strip (pulled from Omeka's latest items or a simple RSS include)
- Footer with contact, credits, licensing
### 5.2 Archive at `kaanu.org/archive` (Omeka S)

Purpose: the system of record for everything.

- Bibliographic items (migrated from the current Quartz bibliography via Zotero, per the migration walkthrough)
- Multimedia items (audio, video, photos from BR Hills)
- Community portraits (Exhibits)
- Thematic presentations (Exhibits)
- Charter page, centre page, members directory, news (Omeka Pages)

Member roles (same as the pipeline doc):
- **Adivasi members:** Author + Reviewer. Can submit items, review others' submissions, annotate.
- **Adivasi scholars:** Author. Can submit and edit own items.
- **Non-Adivasi allies:** Researcher. Can submit via the Contribution module, which places items into a review queue.

Submission flow for approved members:
1. Log in at `kaanu.org/archive/login`
2. Use the Omeka S Contribution module at `/archive/submit` to add a new item (bibliographic, multimedia, or narrative)
3. Item enters the review queue
4. A reviewer checks metadata, consent, community appropriateness
5. Approved items publish and become immediately visible in both the archive and (after next rebuild) the graph

Public visitors can browse and search the archive without any login. Login is only required for contributing, annotating, commenting, and saving selections.

Modules to install on day one:
- CSV Import (for the bibliography migration)
- Zotero Import (for ongoing curator imports from Zotero)
- Value Suggest (for controlled vocabularies on subjects, communities, regions, eras)
- Collecting (for member submissions)
- Contribution (for non-Adivasi ally submissions needing review)
- Annotate (for members to annotate items)
- Comments (for threaded discussion)
- Selections (for members to build personal reading lists)
- Metadata Browse (for faceted navigation)

### 5.3 Graph at `kaanu.org/graph` (Quartz)

Purpose: make the interconnectedness of the archive walkable. A researcher looking at one item can see, at a glance, which other items share its community, region, era, author, or subject tags, and can follow any of those threads.

Implementation: a generated static site, rebuilt from Omeka data on a schedule. Nobody authors pages in Quartz any more. Every page you see at `/graph` shall be produced by a build script that:

1. Calls the Omeka S REST API to fetch all items and their metadata
2. Generates one markdown file per item, with YAML frontmatter capturing its metadata
3. Generates markdown files for each keyword, community, region, era, subject, and author, each listing the items that connect to it
4. Writes wiki-style links between these markdown files
5. Runs Quartz's build step to produce static HTML with backlinks, graph view, and search
6. Deploys the result to `/var/www/kaanu-graph/`

The rebuild runs nightly via cron, and can also be triggered on-demand from an Omeka S admin button (via a small webhook script). This means a freshly published item appears in the archive immediately and in the graph within 24 hours at most, and within minutes if a curator pushes the rebuild button.

- A visual map of the collection's shape (Quartz's graph view)
- Backlinks: "this item is referenced in three exhibits and shares its region tag with 47 other items"
- Wiki-walk navigation: click through from author to their other works, to the communities they wrote about, to other items about those communities
- Keyword clusters: which themes the collection covers densely, which thinly

The archive page for a given item will link to its graph counterpart ("See this item in the graph"), and vice versa, so visitors can switch modes freely.

## 6. Integration: how they become one platform

Four things make this feel integrated rather than like three separate sites:

**Shared visual identity.** One stylesheet, tuned once, applied to all three. Omeka S gets a custom theme based on the stylesheet. Quartz gets a custom theme based on the same. The landing page uses it directly. A visitor moving between `/`, `/archive`, and `/graph` sees the same typography, colours, header, and footer.

**Shared navigation.** A top bar on all three components with the same four links: Home, Archive, Graph, About. Present in the landing page HTML, the Omeka theme header, and the Quartz layout.

**Cross-links at the item level.** Every archive item page has a "View in graph" link. Every graph item page has a "View in archive" link. The mapping is `kaanu.org/archive/item/<id>` ↔ `kaanu.org/graph/item/<id>`. The Quartz build script generates the IDs using the Omeka item IDs, so the mapping is stable.

**Shared membership.** One login (Omeka's), one member directory (Omeka Page), one profile per person. The graph is public so no login question arises there. The landing page has a "Sign in" link that goes to `/archive/login`.

## 7. Phased implementation plan

### Phase 0: Droplet and domain 

- Buy the new droplet (BLR1, 2 vCPU, 4 GB, 80 GB, Ubuntu 24.04)
- Point `kaanu.org` and `www.kaanu.org` A records at the new droplet's IP
- Initial system update, create non-root user, SSH key auth, firewall (UFW) allowing only 22, 80, 443
- Install LEMP: nginx, MariaDB, PHP-FPM (latest stable PHP), plus required PHP extensions
- Install Let's Encrypt via certbot and get certificates for `kaanu.org` and `www.kaanu.org`
- Nightly backup to Backblaze B2 configured from day one

### Phase 1: Omeka S at /archive 

- Download and extract Omeka S into `/var/www/kaanu/archive`
- Configure nginx to serve `kaanu.org/archive` via Omeka
- Create `omeka_s` MariaDB database and user
- Run the installer at `kaanu.org/archive/install`
- Install the ten modules listed in 5.2
- Install a baseline Omeka theme and stub the custom theme to match the Kaanu stylesheet
- Create the `kaanu` site inside Omeka
- Define the three resource templates: Bibliographic Item, Multimedia Item, Community Portrait
- Define the four Value Suggest vocabularies: Subject, Community, Region, Era
- Create the five Pages: Charter, Centre, Members, News, About

### Phase 2: Bibliography migration 

- Follow the `kaanu_bibliography_migration.md` walkthrough
- Inventory the current Quartz bibliography
- Set up a Zotero group library
- Import WIKINDX entries via BibTeX
- Drag PDFs into Zotero, let it retrieve metadata, clean up hand-written entries
- Clean, dedupe, tag, mark `status:ready-for-archive`
- Push a small CSV import as a trial
- Switch to Zotero Import module for the full push
- Verify counts and PDF attachments in Omeka
- Set up the nginx redirect map from old Quartz URLs to new Omeka item URLs

**Deliverable:** the entire current bibliography living in Omeka S, with PDFs attached, controlled-vocabulary tags in place, and existing external links to the old bibliography still working via redirects.
### Phase 3: Landing page 

- Design the Kaanu stylesheet (one designer-day)
-  the landing page HTML and CSS
- Place at `/var/www/kaanu/root/index.html`
- Configure nginx to serve `kaanu.org/` from this directory
- Pull the "latest items" strip from Omeka's RSS feed at build or load time
- Add the top nav bar that will also appear in Omeka and Quartz

**Deliverable:** `https://kaanu.org` shows a proper Kaanu landing page that signposts the archive, graph (placeholder for now), and charter.

### Phase 4: Quartz graph generator at /graph 

- Write `omeka_to_quartz.py`: fetches Omeka items via API, writes markdown files with YAML frontmatter and wiki-links
- Set up a Quartz repository at `/opt/kaanu-quartz/`
- Apply the Kaanu theme to Quartz so it matches the rest
- Configure the build to output to `/var/www/kaanu/graph/`
- Configure nginx to serve `/graph` from that directory
- Set up a nightly cron: `omeka_to_quartz.py` then `npx quartz build`
- Set up a small admin webhook so curators can trigger a rebuild from Omeka

**Deliverable:** `kaanu.org/graph` shows the archive as a walkable graph of interlinked items, keywords, communities, regions, eras, and authors, with cross-links to the archive counterparts.

### Phase 5: Members, charter, launch 

- Finalise the charter text and publish it as a Page
- Define the three member role groups in Omeka with their Access levels
- Invite the first cohort of curators as members with Author rights
- Invite allies with Researcher rights and walk them through the Contribution flow
- Publish the members directory Page
- Soft-launch: share `kaanu.org` with the founding cohort and collect feedback

**Deliverable:** live platform, founding members added, first real submissions and annotations happening.

### Phase 6: Iterate and consolidate 

- Watch which keywords, communities, and regions are getting densely tagged versus thinly
- Add exhibits from the densest clusters
- Refine controlled vocabularies as gaps show up
- Add the on-demand rebuild button once curators start asking "when will my submission appear in the graph?"
- Quarterly: rehearse the backup restore on a staging droplet

## 8. The Omeka-to-Quartz build pipeline

To be thoguht through. 

### 8.1 What it does

Runs as a single script on the droplet, typically nightly via cron.

1. Queries Omeka's REST API at `kaanu.org/archive/api/items` with pagination, fetching all published items and their properties
2. For each item, writes `/opt/kaanu-quartz/content/items/<slug>.md` with:
   - YAML frontmatter: `title`, `id`, `authors`, `year`, `communities`, `regions`, `eras`, `subjects`, `type`
   - Body: the item's description or abstract
   - A "See in archive" link back to `/archive/item/<id>`
   - Wiki-links to each author, community, region, era, subject: `[[author/Nadia-Abu-El-Haj]]`, `[[community/Soliga]]`, etc.
3. For each distinct author, community, region, era, and subject, writes `/opt/kaanu-quartz/content/<facet>/<slug>.md` with:
   - Title
   - Description (if the facet is a Value Suggest term with a description)
   - Auto-generated list of items tagged with this facet (Quartz renders these as backlinks without the script having to enumerate them)
4. Copies any changed exhibits from Omeka Pages into `/opt/kaanu-quartz/content/exhibits/`
5. Runs `npx quartz build` to produce static HTML in `/var/www/kaanu/graph/`
6. Writes a small `build.json` with a timestamp and item count, readable at `kaanu.org/graph/build.json`, so you can sanity-check freshness

### 8.2 Properties it relies on

Only properties that already have a home in Omeka's Dublin Core + bibo schema:
- `dcterms:title`, `dcterms:creator`, `dcterms:date`, `dcterms:subject`, `dcterms:description`
- `dcterms:spatial` (for region) with Value Suggest
- Custom Kaanu properties for `kaanu:community` and `kaanu:era` (defined in the resource templates)

No metadata lives in Quartz. Quartz is a view.

## 9. Hosting cost estimate

On the new droplet:

| Item                                    | Monthly            | Annual               |
| --------------------------------------- | ------------------ | -------------------- |
| Droplet (2 vCPU, 4 GB, 80 GB, BLR1)     | USD 24 / INR 2,000 | INR 24,000           |
| Backblaze B2 (50 GB to start)           | USD 0.30 / INR 25  | INR 300              |
| Domain renewal (kaanu.org)              |                    | INR 1,000            |
| Let's Encrypt certificates              |                    | free                 |
| Email (optional, for contact@kaanu.org) | USD 2              | INR 2,000            |
| **Total**                               |                    | **~INR 27,000/year** |
