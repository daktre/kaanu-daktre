# Kaanu: Collection, Archive, Charter
ಕಾನು

*A unified implementation plan for Kaanu as an independent initiative, bringing together its public collection, its permanent archive, the BR Hills centre, and its charter-based membership.*

## 1. Purpose of this document

Kaanu already exists in pieces. The Bibliography on kaanu.daktre.com curates works on South Indian Adivasi studies. The kaanu-sanchaya planning note sets out an ambition for a finished, annotated archive modelled on Omeka S. A physical centre is planned at BR Hills. A charter is in preparation and will determine membership across three categories of members: Adivasi people, Adivasi scholars, and non-Adivasi allies.

This document folds those ambitions into one plan that can be implemented: a single public-facing Kaanu with two layers underneath, a membership pathway that is light today and extensible tomorrow, and a physical centre at BR Hills that sits at the heart of the collective rather than at its edges.

The plan assumes Kaanu is run as an independent initiative on its own infrastructure. A future bridge to IPH Bengaluru's Sanchaya is kept open, but not on the critical path.

## 2. Starting point

What exists today, to ground the plan honestly:

- **Public site** at kaanu.daktre.com, built on Quartz. Contains the Bibliography and a set of in-progress interpretive writings.
- **Bibliography data** in a mixed state: some entries exist as WIKINDX exports, others as hand-written markdown pages with linked PDFs. No single source of truth.
- **Editorial workflow** in Obsidian (local vault) with Zotero for discovery, following the atelier practice described in the Sanchaya plan.
- **Planning notes** for an Omeka S archive, community portraits for 12 Karnataka Adivasi communities, and a charter-based membership.
- **Physical plan** for a Kaanu centre at BR Hills that will host people, conversations, and collections in person.

## 3. Core principle: one Kaanu, two layers

Everything that follows rests on a distinction the kaanu-sanchaya note already names well, and which we keep: the archive (permanent, structured, citable records) and the atelier (living, interpretive, wiki-shaped writing). The plan treats these as two layers of one initiative, not two initiatives.

The user-facing expression is a single domain, kaanu.daktre.com, and a single visual identity. Underneath, two pieces of software handle what each is best suited to. A visitor does not need to know which layer they are on; contributors and maintainers do.

> **Principle.** The atelier is where Kaanu thinks. The archive is where Kaanu keeps. Both live under one roof, kaanu.daktre.com, with shared navigation, shared identity, and stable cross-links between them.

## 4. System architecture

### 4.1 What the visitor sees

One domain: kaanu.daktre.com. A shared header lets any visitor move between:

- **Home / About / Charter / Centre / Members / News** (atelier pages)
- **Bibliography, Exhibits, Portraits** (archive pages)
- **Interpretive writing, essays, community notes** (atelier pages, cross-linking into the archive where relevant)

The archive lives at a path or subdomain that is still kaanu.daktre.com, for example kaanu.daktre.com/archive or archive.kaanu.daktre.com. The subdomain is simpler to operate; the path is cleaner for visitors. Either works; the first iteration can use a subdomain and migrate to a path later if desired.

### 4.2 What runs under the hood

| Layer | Software | Role | URL |
|---|---|---|---|
| Atelier | Quartz (static site, Obsidian-authored) | Public face of interpretive writing; charter; members directory; physical centre pages; news; landing page | kaanu.daktre.com |
| Archive | Omeka S (open-source digital collections) | Permanent, searchable, metadata-rich records of bibliography items, community portraits, and future multimedia | archive.kaanu.daktre.com |
| Editorial | Obsidian vault + Zotero group library | Drafting, curation, peer review. Private to members. | Local / cloud sync |
| Glue | GitHub (Quartz repo) + simple forms service (Tally or Formspree) | Rebuilds, member signups, change review | GitHub |

The decision to keep two pieces of software (Quartz plus Omeka S) rather than folding everything into one is deliberate. Quartz is excellent at prose, Obsidian-authored, markdown-native, and costs nothing to serve. Omeka S is purpose-built for structured digital collections: Dublin Core metadata, stable item URIs, multimedia handling, CSV import/export, exhibits, a Zotero importer. Collapsing into one platform would weaken either the writing experience or the archival discipline, and gains very little in return because the visitor already sees one site.

### 4.3 Independence

All infrastructure is owned by Kaanu: a Kaanu-controlled VPS, Kaanu-controlled domain, Kaanu-controlled backups. Nothing on the critical path depends on IPH Bengaluru, Sanchaya, or any other external institution. The optional future bridge to Sanchaya (Section 12) is a deposit pathway, not a dependency.

## 5. The Bibliography: consolidating what exists

The Bibliography is the most concrete thing Kaanu has today, and its current mixed state (partly WIKINDX export, partly hand-written markdown with linked PDFs) is exactly the kind of split that a proper archive fixes. The plan is to consolidate first in Zotero, then migrate to Omeka S.

### 5.1 Consolidation

- **Create a Kaanu Zotero group library** (or use an existing one if present) as the single source of truth for bibliography entries.
- **Import WIKINDX** entries via WIKINDX's RIS/CSV export, brought into Zotero.
- **Manually re-enter** the markdown-only entries into Zotero, attaching the linked PDFs where rights permit.
- **Clean up metadata** in Zotero: authors, years, publication type, tags for subject/community/region. This is tedious and essential; budget time for it.

### 5.2 Migration into the archive

- **Use the Zotero importer** module for Omeka S, or export Zotero to CSV and use Omeka S's CSV Import module. Zotero-to-Omeka is the better long-term pipeline.
- **Map fields to Dublin Core** (title, creator, date, subject, type, rights, relation, description). Dublin Core is the archive's vocabulary and stays stable over time.
- **Upload PDFs** into Omeka S only where copyright and community consent permit. For other items, link out or hold the PDF privately and expose metadata only.
- **Carry annotations across** from the markdown pages into the Omeka S item description or a dedicated annotation field. This is where Kaanu's scholarly voice sits on each record.

### 5.3 After migration

- **The public Bibliography** becomes the Omeka S collection at archive.kaanu.daktre.com, with search, filtering, sorting, and stable URIs for citation.
- **The atelier side** keeps pages that introduce, contextualise, or curate subsets of the bibliography (thematic readings, syllabi, reading lists), linking out to archive items by URL.
- **Ongoing additions** follow the workflow in Section 10: discover in Zotero, draft annotation in Obsidian, import to Omeka S, publish.

## 6. The archive: from collection to exhibits

A collection of records is useful. A collection with exhibits is what the kaanu-sanchaya note is reaching for when it speaks of a finished, annotated archive.

Omeka S supports this natively through its Exhibits feature. An exhibit is a curated, narrative presentation built on top of items in the collection, for example:

- **A portrait of one of the 12 Adivasi communities of Karnataka**, drawing bibliography items, photographs, maps, and oral history excerpts into one narrative page.
- **A thematic exhibit** on, for example, forest rights, or on a specific ecological relationship, or on a single scholar's contribution to the field.
- **A site-wide record** of the physical Kaanu centre at BR Hills: the events held there, the materials produced, the people who have visited.

The workflow for building an exhibit mirrors the one in the kaanu-sanchaya plan. A community portrait is incubated as an Obsidian note, marked clearly as a draft on the atelier, and only graduates to the archive as an Omeka S exhibit when the collective is satisfied with it.

### 6.1 Scaling to multimedia and beyond

Omeka S handles images, audio, video, and arbitrary file attachments as first-class item types. As Kaanu's archive grows past documents:

- **Images** (photographs of people, places, objects) are first-class items with their own metadata.
- **Audio** (oral histories, interviews, recorded songs) can be stored directly or linked from object storage.
- **Video** (documentary footage, recorded performances) follows the same pattern as audio.
- **Field documents** (transcripts, notebooks, maps, drawings) can be scanned, OCRd, and deposited as item types of their own.

Once multimedia volumes grow past what the VPS disk comfortably holds, media files move to object storage (Backblaze B2 is the cheapest credible option) with the Omeka S file store pointed at it. This is a configuration change, not a re-architecture.

## 7. The physical centre at BR Hills

The centre is not an appendix to the digital. It is the other half of Kaanu. The plan treats it as such by giving it real presence on the site and by wiring its activity into both the atelier and the archive.

### 7.1 On the site

- **A dedicated Centre section** at kaanu.daktre.com/centre with location, facilities, visiting information, current and past programmes, a small photo record, and contact details.
- **Programme pages** for residencies, gatherings, workshops, and reading circles. Past programmes become atelier entries that can later inform exhibits.
- **A centre-activity feed** for news, which doubles as a low-friction way for anyone at BR Hills to post updates without needing to touch the archive.

### 7.2 Feeding the archive

- **Materials produced at the centre** (talks, transcripts, recordings, documentation of conversations with community members, photographs of site visits) enter the pipeline as any other source would: Zotero or direct Omeka S ingestion, with Obsidian annotation.
- **A local copy of the archive** at the centre (the Omeka S data plus a cached Quartz build) is worth planning for from day one. BR Hills connectivity is not always reliable, and a local mirror means the collection is usable at the centre regardless. A once-monthly offline sync is enough.
- **Consent and co-authorship** for anything recorded at the centre is not a paperwork afterthought. It is an ethical commitment that flows directly into Section 8.

## 8. Charter and membership

The charter is still being drafted, so this section describes the infrastructure the charter will need rather than the charter itself. Two decisions shape the design: membership is charter-based (agreement to the charter is the threshold), and membership is public and lightweight in the first phase.

### 8.1 Member categories

Three categories, as agreed:

- **Adivasi members**: people from Adivasi communities, especially those of BR Hills and adjacent Karnataka regions.
- **Adivasi scholars**: researchers and scholars from Adivasi backgrounds.
- **Non-Adivasi allies**: scholars, practitioners, and friends of the collective who agree to the charter.

The distinction matters for voice and for governance, not for access. All three categories are members; the charter (when ready) can define any differences in responsibilities, voice, or permissions.

### 8.2 Signup and directory (lightweight)

- **A public Charter page** on the atelier carries the charter text with a clear "Become a member" call-to-action.
- **A simple form** (Tally, Formspree, or a self-hosted equivalent) captures: name, preferred display name, email, category, affiliation if any, short statement, and explicit agreement to the charter.
- **A membership coordinator** (a named role, ideally rotating, possibly shared) reviews each submission. Review is not gatekeeping; it is checking that the person has actually read and understood the charter and that they want to be listed.
- **The members directory** is a public page on the atelier, listing approved members grouped by category, with optional profile blurbs and links.
- **The underlying data** for the directory lives as a structured file (YAML or JSON) in the Quartz repo. The coordinator adds or updates entries; a commit triggers a site rebuild. This is deliberately simple and survives staff turnover.

### 8.3 Room to grow

Lightweight today does not mean lightweight forever. The design leaves doors open:

- **Member-only areas** (e.g., working drafts, internal discussion) can be added later with a thin auth layer (Netlify Identity, Cloudflare Access, or a simple shared password on sensitive pages).
- **Permissions in the archive** can later map member categories to Omeka S user roles (contributor, editor, reviewer). Omeka S has native support for roles, so this is configuration, not development.
- **Access tiers for sensitive records** (e.g., community-internal materials that should not be public) can be introduced by putting those items behind an Omeka S restricted-access module, with access granted by member category.

## 9. Infrastructure: the independent stack

### 9.1 Hosting

- **Server**: one VPS, e.g. Hetzner CPX21 (Falkenstein or Helsinki) or Hetzner India partner if latency matters. Roughly INR 400 to 600 per month. Handles Omeka S (PHP and MySQL) and serves the static Quartz build.
- **OS and stack**: Ubuntu 22.04 LTS or 24.04 LTS, Nginx, PHP-FPM, MySQL or MariaDB. Standard LEMP.
- **SSL**: Let's Encrypt, automatic renewal via certbot. Free.
- **DNS**: kaanu.daktre.com (primary) and archive.kaanu.daktre.com both pointed at the VPS. kaanu.in is worth registering defensively for future use but is optional.

### 9.2 Build and deploy

- **Quartz site** built on push from the GitHub repo (GitHub Actions to rsync the built static files to the VPS, or GitHub Pages fronted by Cloudflare).
- **Obsidian vault** kept in a private repo; a subset (the publishable notes) mirrored to the public Quartz repo.
- **Omeka S** updated via its own admin interface; plugins and theme changes versioned separately in a small "omeka-config" repo.

### 9.3 Backups and resilience

- **Database**: nightly mysqldump to Backblaze B2, encrypted. 30-day retention.
- **Uploaded files** (PDFs, images, audio): nightly rsync to Backblaze B2. Incremental.
- **Offsite copy** of the built Quartz site kept on GitHub Pages as a hot standby.
- **Restore drill** done once a quarter: spin up a throwaway VPS, restore from backups, confirm the site works. If a restore has never been rehearsed, assume it does not work.
- **Monitoring**: UptimeRobot (free tier) for the public URLs, plus a simple cron-emailed health check for the Omeka S admin. Alert to two people, not one.

### 9.4 Domain and ownership

- **Domain registration** in a collective-controlled account, not a personal one. Two people with admin access minimum.
- **Server root access** held by at least two maintainers.
- **Runbook** (one page) documents how to log in, where backups are, how to restore, and who to contact. Kept in the private Obsidian vault.

## 10. Editorial workflow, end to end

The workflow knits the whole plan together. It is the same whether the output is a bibliography entry, a community portrait, or a multimedia record.

| Step | Action | Tool |
|---|---|---|
| 1 | Discover a source or identify a subject | Reading, field work at BR Hills, peer recommendation |
| 2 | Curate and collect metadata | Zotero (Kaanu group library) for bibliographic sources; direct upload for field materials |
| 3 | Draft annotation or narrative (private) | Obsidian vault |
| 4 | Peer review within the collective | Obsidian + group channel / email |
| 5 | Publish provisional version (if appropriate) | Quartz atelier, clearly marked as draft |
| 6 | Deposit into the archive | Omeka S (Zotero import for bibliography, manual item creation for other records) |
| 7 | Add annotation and metadata in the archive | Omeka S admin |
| 8 | Build or update an exhibit if the item joins a narrative | Omeka S Exhibits |
| 9 | Cross-link from atelier to archive item | Quartz rebuild |

## 11. Implementation phases

A realistic order. Each phase produces something visibly usable on the public site.

### Phase 0: Foundation (month 1)

- Provision VPS, set up DNS for kaanu.daktre.com and archive.kaanu.daktre.com, install Nginx and the LEMP stack, configure SSL.
- Install Omeka S at archive.kaanu.daktre.com. Confirm it works empty.
- Set up backups (Backblaze B2), monitoring (UptimeRobot), and two-maintainer access.
- Apply a shared visual identity: same header, colour palette, and typography for Quartz and Omeka S. A skilled designer for one short engagement here pays off for years.

### Phase 1: Unify the atelier (months 1 to 2)

- Clean up the existing Quartz site. Decide what pages stay, what moves into the archive, and what is retired.
- Publish the charter (or a clear "charter in preparation" page) and the membership signup form.
- Launch the members directory scaffold, even if empty at first.
- Publish the Centre section with BR Hills location, programmes, and visiting details.

### Phase 2: Migrate the bibliography (months 2 to 4)

- Consolidate WIKINDX and markdown entries into the Zotero group library. Clean metadata.
- Import into Omeka S. Map to Dublin Core.
- Upload PDFs where rights permit; link out otherwise.
- Migrate existing annotations into Omeka S item descriptions.
- Replace the atelier's current Bibliography pages with short curated reading lists that link out to the archive.

### Phase 3: First exhibit and first community portrait (months 3 to 6)

- Pick one community portrait (from the 12 planned) as the pilot. Incubate in Obsidian.
- When ready, publish as an Omeka S exhibit, with bibliography cross-links, photographs, and narrative layer.
- Use learnings to formalise the portrait workflow and schema for the remaining 11.

### Phase 4: Harden and document (months 4 to 6)

- Refine metadata schemas for multimedia and non-bibliographic records.
- Set up the Zotero-to-Omeka S recurring import so ongoing discoveries flow through automatically.
- Publish the editorial workflow documentation as a public page, so contributors know how things move through the system.
- Rehearse a full backup restore for the first time.

### Phase 5: Multimedia and scale (month 6 onwards)

- Move media files to Backblaze B2 object storage.
- Introduce audio and video item types with transcription pipeline (OpenAI Whisper or similar).
- Begin the oral history collection workflow at the BR Hills centre.
- Revisit the membership model: does anything want to move from lightweight to authenticated?

## 12. Relationship with Sanchaya (optional, future)

Hosting is independent. But the infrastructure choice (Omeka S on both sides, Dublin Core metadata, CSV import/export) deliberately keeps a clean migration path to Sanchaya. If Kaanu ever decides to deposit its archive at IPH Bengaluru for institutional permanence, the pathway is:

- **CSV export** from Kaanu's Omeka S at archive.kaanu.daktre.com.
- **CSV import** into Sanchaya as a named, independent Kaanu collection.
- **Periodic sync** (e.g., annual) with Sanchaya mirroring the Kaanu archive for redundancy, while Kaanu remains the live, editorial home.

This keeps institutional permanence available as an option without making Kaanu dependent on it today.

## 13. Costs, roles, and governance

### 13.1 Indicative annual cost

| Item | Provider | Annual cost (INR) |
|---|---|---|
| VPS (CPX21 class) | Hetzner or equivalent | 5,000 to 7,500 |
| Domain registration | Any registrar | 1,000 to 2,000 |
| Backups (Backblaze B2, 100 GB) | Backblaze | 800 to 1,200 |
| Form service | Tally (free) or paid tier | 0 to 2,500 |
| Monitoring | UptimeRobot free | 0 |
| Designer engagement (one-off, Phase 0) | Freelance | 25,000 to 60,000 (one time) |
| **Total recurring** |  | **approx. 7,000 to 13,000 per year** |

The largest cost is human time: consolidation of the bibliography, migration work in Phase 2, community portrait research, and membership coordination. Infrastructure itself is cheap.

### 13.2 Named roles

- **Technical maintainer** (at least two people): server, backups, Omeka S updates, Quartz deploys.
- **Editorial coordinator**: bibliography curation, Obsidian workflow, peer review scheduling.
- **Membership coordinator**: charter signups, directory maintenance, new-member orientation.
- **Centre coordinator** (BR Hills): on-ground programmes, local syncing of the archive, community consent processes.

These are roles, not necessarily distinct people. One person can hold more than one. What matters is that every role is named and has a backup, so that no function depends on a single individual.

### 13.3 Data sovereignty and ethics

The archive will hold materials about Adivasi communities. The plan commits to:

- **CARE principles** (Collective benefit, Authority to control, Responsibility, Ethics) alongside FAIR (Findable, Accessible, Interoperable, Reusable), with CARE taking precedence where the two tension.
- **Community consent** for any material that crosses from private or community-internal into public deposit. Consent is recorded as part of the item's metadata, not kept on a side channel.
- **Attribution and provenance** in every record: who contributed, in what role, under what permissions. An Adivasi member who records an oral history is named as a co-author or source, not erased behind a "Kaanu" byline.
- **A review mechanism** so community members can request takedown, amendment, or re-classification of items. The charter will specify how; the archive metadata leaves space for it from day one.

## 14. Risks and open questions

- **Ownership of the domain and server**: who (collectively) holds them? The charter will answer this; the plan flags it as a governance decision, not a technical one.
- **PDF rights**: some items in the existing bibliography may not be redistributable. Default policy: metadata-only in the public archive unless rights are clearly permissive.
- **Succession**: if the current maintainers step away, who takes over? Two maintainers minimum, plus a written runbook.
- **Migration effort for the bibliography** is the single largest near-term cost. Plan for it explicitly, and consider paying for cleanup work rather than relying on goodwill.
- **Charter timing**: the site can ship in Phase 1 with a placeholder Charter page ("in preparation, contact us if you want to contribute"). Full membership workflow activates when the charter is adopted.
- **Offline at BR Hills**: plan the local mirror early. It is easier to design in from the start than to retrofit.

## 15. Summary

One domain, kaanu.daktre.com. One visual identity. Two layers underneath: Quartz for interpretive writing and Omeka S for the permanent archive. The Bibliography migrates from its current mixed state into a clean, citable, searchable archive. Community portraits incubate in Obsidian and graduate to the archive as exhibits. The BR Hills centre is treated as a first-class part of the collective, with its own section on the site and its materials flowing into the archive. Membership is charter-based and lightweight today, with the structure ready to grow into something more involved when the charter calls for it. Infrastructure is independent, cheap, and portable; the option to deposit into Sanchaya stays open but is not on the critical path.

The plan is implementable in six months of modest effort by a handful of people. What it produces at the end is not just a website. It is Kaanu made durable: a collection that can be cited, an archive that can be trusted, a centre that has a home on the internet, and a charter around which a growing community of Adivasi people, Adivasi scholars, and allies can gather.
