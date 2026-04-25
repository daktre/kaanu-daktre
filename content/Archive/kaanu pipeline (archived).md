

*How a document enters the collection, how curators keep it updated, how members submit remotely, and what registered users can do that anonymous visitors cannot.*

## 1. What this document covers

The main Kaanu plan sets out the architecture: atelier on Quartz, archive on Omeka S, one shared domain. This companion document covers the human and operational layer on top of that: the workflow that turns a source identified in the morning into a permanent, citable, annotated record in the archive by the end of the week.

It answers four questions together:

- How does a new item get into the collection, concretely?
- What is the easiest ongoing workflow for curators?
- How can any member, eventually, submit an item from wherever they are?
- What can a registered user do with the collection, over and above what an anonymous visitor can do?

Browsing and searching the collection stays fully open. Registration is never required to read Kaanu.

## 2. The pipeline at a glance

Every item, regardless of where it comes from, moves through the same seven stages. The tools differ slightly by item type, but the stages do not.

| Stage | Name | What happens |
|---|---|---|
| 1 | Identify | A curator or member encounters a source worth adding: a reading, a field document, a recording, a photograph, a tipped recommendation. |
| 2 | Capture | The source is saved into a staging area with initial metadata. Nothing is public yet. |
| 3 | Triage | A reviewer checks: is this in scope? Is it a duplicate? Are rights and consent clear? What work does it still need? |
| 4 | Enrich | Metadata is cleaned, tags applied, annotation drafted, PDF attached if permitted. |
| 5 | Deposit | The item is promoted into the live archive with a stable URI. Published to the public or to members-only as the rights allow. |
| 6 | Announce | The item becomes visible. Optional: mentioned in a monthly "new arrivals" digest. |
| 7 | Interact | Registered users can annotate, comment, save, suggest edits. Anyone can cite, read, and link to it. |

Stages 1 to 5 are the ingestion pipeline. Stages 6 and 7 are what happens after the item is live. Some items also go through an eighth stage, revision, when new information, community consent changes, or scholarly corrections warrant an update. Revisions leave an edit trail in Omeka S.

## 3. Zotero as the capture tool for bibliographic items

For books, journal articles, book chapters, theses, reports, and similar textual works, Zotero is the right place to do stage 2 (capture) and stage 4 (enrich). Three reasons:

- **It meets curators at the point of reading.** The Zotero Connector browser extension captures a full bibliographic record (and, usually, the PDF) with one click from any publisher site, Google Scholar, JSTOR, or archive. Curators do not need to leave the page they are reading.
- **It is built for groups.** A Kaanu Zotero group library lets multiple curators contribute simultaneously, with folders, tags, and shared notes. Nothing custom to build.
- **It bridges cleanly into Omeka S.** The Omeka S Zotero Import module is the supported path. Items flow from Zotero into Omeka S with Dublin Core fields populated. It is a bridge, not a rewrite.

Zotero is not the right place for photographs, audio recordings, video, field notebooks, oral histories, or objects. Those bypass Zotero entirely and are added directly to Omeka S staging. Zotero can technically hold such items as attachments, but that would turn Zotero into a general asset manager, which it is not.

### 3.1 The Zotero setup

- **One Kaanu group library** (name suggestion: "Kaanu Collection"). Group type: private by default, open to new members by invitation, curator-writeable.
- **A folder (collection) structure** that mirrors the archive taxonomy: one folder per community, thematic folders for cross-cutting subjects, plus a small set of workflow folders: Inbox, Needs-review, Ready, In-archive.
- **A tag discipline** that matches the archive's controlled vocabulary (Section 8). Tags in Zotero carry over to Omeka S, so consistency pays.
- **Curator Zotero accounts** are personal (not shared). Each curator logs in as themselves, so authorship of each capture is recorded. The group library pools their work.

### 3.2 The bridge into Omeka S

The Zotero Import module for Omeka S does three useful things: it pulls items from the Zotero group on demand or on a schedule, it maps Zotero fields to Dublin Core, and it avoids duplicates by checking the Zotero item key. Practical notes:

- The module runs as an admin action or as a cron job. For Kaanu's volume, a weekly cron plus an on-demand trigger is enough.
- Only items tagged "Ready" (or moved into the "Ready" folder, depending on configuration) are imported. Drafts stay in Zotero.
- Once imported, the Omeka S item is the canonical public record. Further annotation and exhibit work happens on the Omeka S side.
- Later edits to the Zotero record can be re-synced if needed, but by convention the Omeka S side becomes the source of truth post-deposit. This avoids two-way sync headaches.

## 4. The curator workflow, day to day

Three common paths, walked end to end.

### 4.1 A journal article found online

1. Curator is reading in the browser, spots a relevant article.
2. One click on the Zotero Connector icon: the article metadata and PDF are saved into their personal Zotero, auto-filed into the Kaanu group library's Inbox.
3. Curator opens Zotero desktop. Adjusts title/author if needed. Adds tags: at minimum, one subject, one community (if applicable), and the status tag "needs-review".
4. At the weekly review meeting (or async on a channel), the editorial coordinator reviews the Inbox. Items that are in scope, non-duplicate, and well-formed move to the "Ready" folder. The rest get comments: "check rights", "duplicate of X", "need abstract", etc.
5. Zotero Import module runs (weekly cron, or triggered manually). "Ready" items enter Omeka S as new archive records with Dublin Core metadata.
6. The archive record gets a stable URI immediately. If an annotation is warranted, a curator drafts it in Obsidian, then pastes it into the Omeka S item description field. If not, the item stands on its metadata alone.
7. If the item belongs in an active exhibit (e.g., a community portrait in progress), the curator adds it to the exhibit.

### 4.2 A PDF a curator already has on disk

1. Drag and drop PDF into Zotero.
2. Zotero attempts automatic metadata extraction (via DOI lookup or a PDF retrieval service). If it succeeds, the record is populated.
3. If it fails, curator fills metadata manually. This is still faster than any alternative.
4. From here the flow is identical to 4.1.

### 4.3 A photograph, audio recording, or field document

1. Skip Zotero. Log directly into Omeka S admin.
2. Create a new item using the relevant resource template (Photograph, AudioRecording, FieldDocument, etc.). Resource templates pre-fill the metadata fields that type needs.
3. Fill metadata. For community-origin materials, the consent field is mandatory: who agreed, when, at what access level.
4. Upload the media file.
5. Set visibility: Public or Member-only.
6. Save. Item is immediately live.

Photographs and audio do not go through "Zotero import". They also do not usually need the "needs-review / ready" workflow, because the curator adding them has the context and rights already. But they do need the triage discipline: the curator must actively confirm rights and consent before publishing.

## 5. Remote member submissions

Once membership is active, submissions from members (and tipped suggestions from non-members) enter the pipeline at stage 2, and then follow the same flow. Two submission paths.

### 5.1 Authenticated member submission

Every charter-signed member is issued an Omeka S user account at the "Researcher" or "Author" role level. They log in and use the Contribution module's submission form:

- URL or DOI (if a web-accessible source)
- OR a PDF upload (for sources not online)
- Title, author(s), year, publication details
- Suggested subject tags (from the controlled vocabulary, with autocomplete)
- Suggested community tags
- A short note: "Why this belongs in Kaanu"
- Rights statement, to the best of the submitter's knowledge

The submission lands in a queue that only the triager sees. Members see a status page for their own submissions: pending, accepted (link to the archive item), needs-more-info, declined (with reason).

### 5.2 Public tip submission

A lightweight form on kaanu.daktre.com/suggest, open to anyone, no login:

- Title, URL or citation
- Optional contact name and email
- A note: "Why you think this belongs in Kaanu"

Public tips go to a curator's inbox (or a shared email). A curator evaluates and, if warranted, captures the item via the normal Zotero route. The tipper, if they provided contact, gets a short acknowledgement and, if accepted, a link to the item once live.

### 5.3 Why two paths, not one

The distinction matters because authenticated members' submissions are attributable, trackable, and can carry richer metadata; public tips are low-friction and catch recommendations from friends, fellow-travellers, and visitors who do not want to join. Both feed the same queue in the end.

### 5.4 Triage load

Triage is the bottleneck. Budget for it from day one: a named triager role, a weekly review slot (60 minutes), and a clear protocol for declining items (always with a short reason). If the queue grows faster than the triager can process, that is a signal to add a second triager, not to loosen standards.

## 6. Tools: recommended stack

| Function | Tool | Why |
|---|---|---|
| Capture bibliographic items | Zotero + Zotero Connector | One-click from any webpage; extracts metadata; free; widely used in research |
| Group library for curators | Zotero Groups (Kaanu Collection) | Multi-user, folders, tags, notes, shared access |
| Bridge to archive | Omeka S Zotero Import module | Supported, field-mapped, avoids duplicates |
| Non-bibliographic ingestion | Omeka S admin + resource templates | Purpose-built; Dublin Core + media handling |
| Member submissions | Omeka S Contribution module | Member identity flows through; attribution and tracking |
| Public tips | Tally form or Formspree | No login, minimal friction; email to curator inbox |
| Annotations on archive items | Omeka S Annotate module | Member-written notes on items, optional public/private |
| Comments and discussion | Omeka S Comments module | Threaded comments, moderated |
| Personal lists | Omeka S Selections module | Each member builds their own reading lists |
| Controlled vocabulary | Omeka S Value Suggest + a published vocabulary page | Keeps tag entropy down; autocompletes in forms |

## 7. The registered user system

Registration is available only to charter-signed members. Account creation happens after the membership coordinator has approved a signup. This is not a self-service "anyone can register" system; charter agreement is the threshold.

### 7.1 What anonymous users can do (no registration)

- Browse the archive by collection, exhibit, community, subject, tag, type.
- Full-text and metadata search across the entire public archive.
- Read and download any public item (where rights permit).
- Cite items via stable Dublin Core URIs.
- Read all atelier pages: essays, community portraits, charter, member directory, centre information, news.
- Submit a public tip via the /suggest form.

This is the default experience. No login wall, no soft wall, no "sign up for more results" nudge. Kaanu exists to be read.

### 7.2 What registered members can do (over and above)

- Submit items to the curator queue, with full metadata form, attribution, and tracking of their submissions.
- Annotate archive items with scholarly notes. Annotations can be set member-only, public, or private to the author.
- Comment on items and exhibits. Comments are moderated.
- Maintain personal Selections (saved reading lists, exportable to BibTeX or CSV).
- Suggest edits to metadata or annotations. Suggestions go to a curator for action.
- Access member-only items and exhibits, where community consent has set the access level to members.
- Download content at the level their member category permits (see Section 9 on access tiers).
- Receive the optional monthly "new arrivals" digest.

### 7.3 Member categories and permissions

The three member categories (Adivasi members, Adivasi scholars, non-Adivasi allies) map to Omeka S user roles, which control what each can do. The default mapping, which the charter can refine:

| Category | Omeka S role | What they can do |
|---|---|---|
| Adivasi member | Author / Reviewer | All Member actions + priority access to community-internal materials from their own community, and an explicit say in consent decisions for those |
| Adivasi scholar | Author | All Member actions; access to member-only items as defined by consent |
| Non-Adivasi ally | Researcher | All Member actions; access to public and general member-only items, but not to community-internal items unless specifically invited |

These are starting defaults. The charter is the right place to decide whether the distinctions are finer or looser. The Omeka S role system is flexible enough to express most choices the charter might make.

### 7.4 Account lifecycle

- Signup: a would-be member fills the charter signup form on the atelier (from the main plan, Section 8.2).
- Approval: the membership coordinator reviews and approves.
- Provisioning: the coordinator creates an Omeka S account at the appropriate role, and adds the member to the public members directory.
- Offboarding: if a member leaves, the account is deactivated (not deleted, to preserve attribution on their past contributions).
- Audit: a quarterly check that active accounts match the directory. Inactive-for-a-year accounts are re-confirmed by email.

## 8. Metadata and tagging discipline

A collection is as good as its metadata. Every archive item, regardless of type, has at minimum:

- Title
- Creator(s) with role (author, editor, photographer, speaker, community contributor)
- Date or date range
- Type, from a fixed list
- Rights (a controlled field, never blank)
- Description
- Source or provenance
- At least one subject tag
- At least one community tag, where applicable

### 8.1 Controlled vocabulary

To stop tag entropy, Kaanu maintains a published vocabulary page at kaanu.daktre.com/vocabulary. Four facets:

- **Subject**: forest rights, ethnobotany, health, language, ritual, livelihoods, displacement, resource governance, education, governance, ...
- **Community**: Soliga, Jenu Kuruba, Betta Kuruba, Yerava, Paniya, Kadu Kuruba, and other Karnataka Adivasi communities. Names decided by communities themselves where possible.
- **Region**: BR Hills, Nilgiri, Western Ghats, MM Hills, Kodagu, ...
- **Era**: pre-colonial, colonial, post-Independence, post-FRA (Forest Rights Act 2006), contemporary

The vocabulary is versioned (the page carries a last-updated date). Members can propose additions via the normal suggest-edit pathway. Consistency matters more than exhaustiveness: a tag that eight items share is worth ten tags that one item each has.

### 8.2 Resource templates

Omeka S resource templates encode the metadata required for each item type. Recommended templates for Kaanu:

- BibliographicItem (for Zotero-imported works)
- Photograph
- AudioRecording
- VideoRecording
- OralHistory (a subtype of AudioRecording with narrator and consent fields)
- FieldDocument (notebooks, transcripts, maps)
- Exhibit (curated narratives)
- Object (future-facing: objects that may be documented digitally but live physically at the BR Hills centre)

Each template enforces the required fields for its type. A curator cannot save an OralHistory item without a consent field filled. This is discipline by design, not by reminder.

## 9. Rights, consent, and sensitive materials

Community consent is the hardest part of this system and the one that most distinguishes an Adivasi-studies archive from a generic bibliographic collection.

### 9.1 Consent fields on every item of community origin

- Who gave consent (individual name, community group, or both)
- What form the consent took (oral, written, recorded)
- Date and location
- Access level consented to: public, members, specific communities, curator-only
- Any restrictions: no commercial use, no derivative works, time-limited, revocable on request
- A pointer (not the document itself) to where the consent record is held

For items where consent is ambiguous or not obtained, the default is metadata-public, file-private. An item can exist in the archive as a record without its full contents being exposed.

### 9.2 Revocation and re-classification

Consent can change. A community might decide a previously-shared oral history should no longer be public. The archive honours that:

- Every item has a "Request reclassification" link visible to members.
- Reclassification requests go to the editorial coordinator, who responds within two weeks.
- Reclassification may move an item from public to member-only, member-only to curator-only, or in extreme cases, remove the file entirely while keeping the metadata record for scholarly integrity.

### 9.3 Sensitive materials policy

- Materials considered sensitive by the source community are flagged and default to member-only.
- Materials about ritual, ancestral, medicinal, or ceremonial knowledge are not deposited at all without explicit community agreement.
- When in doubt, the default action is "do not publish yet" and "ask first".

## 10. Roles in the pipeline

| Role | Responsibilities |
|---|---|
| Contributor | Captures items (any curator or, later, any member). Uses Zotero Connector or the submission form. Adds minimum metadata on capture. |
| Triager | Weekly review of the queue. Moves items to Ready, sends back with comments, declines with reasons. Named role, can rotate. |
| Editorial coordinator | Sign-off authority for enrichment. Orchestrates the Zotero-to-Omeka run. Drafts or commissions annotations. |
| Annotator | Writes scholarly notes on items and exhibits. Many hands; annotations attributed. |
| Archive admin | Omeka S technical: user accounts, role configuration, module updates, backups, restore drills. Held by technical maintainer(s). |
| Membership coordinator | Issues and deactivates Omeka S accounts alongside charter directory updates. |
| Centre coordinator (BR Hills) | On-ground capture of photographs, audio, oral histories. Manages consent at source. Maintains the local mirror. |

One person can hold more than one role. The rule is that every role has a named holder and a named backup, so nothing is invisible and nothing is single-pointed.

## 11. Implementation order

This rolls out in four phases, sequenced with the main plan.

### Phase A: Curator-only pipeline (months 1 to 2, alongside Phase 2 of the main plan)

- Zotero group library created. Two to four curators trained.
- Tag vocabulary drafted (version 0.1) and published at /vocabulary.
- Omeka S Zotero Import module installed and tested with a small sample batch.
- Resource templates defined for the four or five most common item types.
- Weekly review cadence established.

### Phase B: Public tips and curator tools (months 2 to 3)

- /suggest form live for public tips.
- First curator annotations appearing on archive items.
- First exhibit stubs created on the archive side, even if empty.

### Phase C: Member submissions and interactions (months 4 to 5, once charter is active)

- Omeka S user accounts issued to first wave of members.
- Contribution module live on /submit.
- Annotate, Comments, Selections modules installed and exposed to members.
- First member-submitted items reach the archive.

### Phase D: Sensitive access tiers and member-only layer (month 6 onwards)

- Consent field fully enforced on oral histories and community-origin photographs.
- Member-only visibility activated for items whose consent level calls for it.
- Category-specific access (Adivasi member, scholar, ally) tested with a small set of items before being turned on widely.
- Revocation and reclassification process exercised at least once end to end.

## 12. Summary

Zotero is the curator's capture tool for bibliographic items because it meets them where they read and it connects cleanly into Omeka S. Non-bibliographic items go direct to Omeka S with type-specific templates that enforce the metadata each kind of thing needs. Triage is the unglamorous, essential role that keeps quality up as volume grows. Member submissions land in the same queue as curator captures, which means one pipeline, one set of standards, and one source of truth. Interaction (annotate, comment, save, suggest) is what registered members can do that anonymous visitors cannot; but anonymous visitors can browse, search, read, and cite the entire public archive without any login wall. Consent is a first-class metadata field, not an afterthought, and the archive supports revocation and reclassification by design.
