# Kaanu: Do we need both a Quartz site and an Omeka S archive?

*A critical evaluation of the dual-stack proposal in the main plan, with a fresh recommendation.*

## 1. The question, honestly framed

The main plan recommends keeping two pieces of software: Quartz for atelier pages (essays, charter, directory, centre, news) and Omeka S for the archive (bibliography, exhibits, multimedia). I argued that each does something the other cannot, and proposed both under one domain.

That recommendation deserves a second look. Running two systems costs real time: two admin surfaces, two backup targets, two update cadences, two sets of content updates to coordinate, cross-links that have to be maintained manually. For a small collective, that overhead is not trivial. The case for two systems has to be that each one is genuinely load-bearing, not that each one is nice to have.

This note tests that case. It evaluates what each system does, what either can give up, and then revises the recommendation in light of the evaluation.

## 2. What each system is actually for

### 2.1 Quartz (the current Kaanu site)

**Designed for:** publishing a personal or collective knowledge base from an Obsidian vault. Markdown in, static HTML out. Bidirectional links, backlinks, wiki-style navigation, minimal theming, fast to serve.

**Good at:** essays, notebooks, interpretive writing, linked prose, personal intellectual spaces. "A wiki that feels like a book."

**Free of:** runtime costs (static hosting), database maintenance, server-side updates.

**Bad at:** structured records, anything that needs metadata fields, multimedia cataloguing, user accounts, contribution workflows, citation-stable URIs in the archival sense, faceted search, anything that needs to be edited from multiple places by multiple people without git.

### 2.2 Omeka S

**Designed for:** digital archives and museum collections. Structured items with Dublin Core metadata, stable URIs, multimedia, exhibits, user roles, controlled vocabularies. Built for institutions.

**Good at:** catalogues, collections, exhibits, multimedia, metadata discipline, import from citation managers, contribution workflows, access tiers, annotations.

**Capable of:** hosting prose via its Pages and Exhibits features. The authoring experience is functional, not graceful.

**Bad at:** feeling like a personal or collective intellectual space. The aesthetic and navigational instincts of Omeka S are those of an institution, not a wiki. Writing long-form essays in Omeka S Pages is slower than writing markdown. Local-first drafting is awkward. Git-versioned prose is not the native model.

## 3. The current Quartz site, evaluated

Before asking what should happen, it is worth being honest about what exists.

### 3.1 What is working

- The atelier work (essays, notes, in-progress writing) lives in a format that suits its state: provisional, linked, revisable.
- Curators can author in Obsidian, which they already use, and publish with git push.
- The site is fast, cheap to serve, and indexed by search engines.

### 3.2 What is already cracking

- The Bibliography is in a mixed state: some entries come from WIKINDX exports, others are hand-written markdown with linked PDFs. There is no single source of truth, no shared metadata schema, and no systematic way to browse or filter.
- PDFs are hosted as attachments to pages, with no metadata beyond the link text. Rights, provenance, and community consent are not recorded anywhere structured.
- Citation-grade permanence is absent. A theme change, a page rename, or a restructure can break every URL that points to a bibliography entry.
- There is no contribution workflow. Anyone wanting to add an item has to learn git, markdown, and the site's file conventions, or ask a maintainer to do it for them.
- Scaling is unproven. The atelier handles tens of pages comfortably; a growing bibliography of hundreds of items stresses the model.

These are not Quartz failures. They are category-mismatch failures. Quartz is not a catalogue, and the Bibliography is asking it to be one.

## 4. Can one replace the other?

### 4.1 Could Quartz do everything the archive needs?

Only at very small scale, and with sacrifices the current vision does not seem willing to make:

- Structured metadata: possible via YAML frontmatter on each markdown file, but no enforcement, no Dublin Core mapping, no faceted queries, no validation.
- Faceted search: partial via Quartz plugins; nowhere close to what Omeka S gives out of the box.
- Multimedia as first-class items: not really. Quartz can embed images and audio players, but it has no concept of an audio recording as a catalogued item with speaker, date, location, consent, duration, and a stable URI.
- User accounts and contribution: absent. Would require an external auth layer and a custom submission tool.
- Exhibits (curated narratives over items): possible as hand-written pages, but with no structured relationship to the underlying items they draw on.
- Consent tiers and access control: absent.

**Verdict:** Quartz alone cannot meet the ambition the plan and the kaanu-sanchaya note have already set out. For a very small collection of text-only items with no multimedia and no member contributions, it would do; for everything else, it cracks.

### 4.2 Could Omeka S do everything the atelier needs?

This question is the interesting one, because the honest answer is closer to "yes" than I initially allowed.

- Pages: Omeka S Pages can hold the charter, centre information, members directory, news, and essays.
- Exhibits: Omeka S Exhibits are the natural home for community portraits and thematic presentations.
- Wiki-shape: Omeka S does not have bidirectional backlinks or a knowledge-graph view, but it has item-to-item relations and can express cross-references. The "wiki feel" of the current atelier is a genuine loss; whether it matters depends on how much of Kaanu's public identity rests on that particular shape.
- Obsidian authoring workflow: there is a real trade-off here. Writing directly in Omeka S Pages is slower and less graceful than writing in Obsidian. The workaround is a one-way pipeline: keep drafting in Obsidian, then publish selected pages to Omeka S via a small export script. This is achievable (Omeka S has a REST API), but it is custom work, and it loses Quartz's automatic wiki-link rendering.
- Design flexibility: Omeka S themes are less easy to customise than Quartz stylesheets. An engaged designer can make Omeka S feel like Kaanu; a disengaged one will leave it feeling like a museum database.

**Verdict:** Omeka S alone can do everything the plan asks for, with genuine but manageable trade-offs: no native wiki-graph, less graceful prose authoring, more design work up front.

## 5. Three realistic paths

| Path | What it looks like | Trade-off |
|---|---|---|
| **A: Both (current plan)** | Quartz at kaanu.daktre.com for atelier; Omeka S at archive.kaanu.daktre.com for archive. Shared design, cross-linked. | Highest capability. Preserves the wiki-graph atelier feel and the Obsidian authoring workflow. Costs two systems of operational overhead and a lifetime of maintaining cross-links. |
| **B: Omeka S only** | Everything on Omeka S: atelier pages as Omeka S Pages, archive as items and exhibits. Obsidian remains the private drafting tool; a one-way pipeline publishes selected pages. | Lowest operational overhead. One admin, one backup, one URL space. Loses the wiki-graph atelier; prose authoring goes via pipeline rather than direct push. Needs more design work up front. |
| **C: Quartz only** | Everything on Quartz with YAML frontmatter pretending to be a catalogue. Archive ambitions reduced to a text-only, small-scale collection. | Lowest capability. Simplest system. Only viable if Kaanu accepts a much smaller ambition than what the plan describes. Multimedia and member submissions effectively ruled out. |

## 6. What the decision actually turns on

The choice between Path A and Path B is not primarily a technical one. It turns on two questions about Kaanu's character, which only the collective can answer.

### 6.1 Is the atelier-as-wiki part of what Kaanu is?

The current site's atelier, with its Obsidian-authored linked prose, is a particular aesthetic and intellectual choice. Some collectives build their identity around this shape. Others would be equally well-served by a sequence of well-written pages and exhibits on an archive platform. The question is whether the wiki-feel is something Kaanu values in itself, or whether it is a by-product of the tools that were to hand.

If wiki-feel is central, Path A is worth its overhead. If the essays could just as well live as exhibits and pages on the archive, Path B is cleaner.

### 6.2 How much maintenance capacity does Kaanu realistically have?

Two systems is not twice the work, but it is meaningfully more than one. Every year: two sets of software updates, two backup restores to rehearse, two sets of SSL renewals to confirm, two content update cadences to keep in sync. For a small collective, this is the difference between "maintained comfortably" and "let slide in the second year".

If Kaanu has at least two technical maintainers with time, Path A is sustainable. If maintenance will fall on one person who already has other commitments, Path B halves their ongoing load.

## 7. Revised recommendation

I would now propose **Path B** as the default, with Path A held as an explicit, deliberate upgrade if and when the wiki-graph atelier proves essential.

Concretely: Omeka S becomes the whole of kaanu.daktre.com. Pages cover charter, centre, members directory, news, about. Exhibits cover community portraits and thematic presentations. Items cover bibliography and multimedia. Obsidian remains the private drafting space for curators. A small publishing pipeline pushes selected notes from Obsidian to Omeka S Pages when they are ready to go public.

This gives Kaanu one system to learn, one admin UI, one backup, one auth, one set of URLs, and one coherent visual identity. It also makes the hardest thing (permanent, citable, annotated records with multimedia and consent control) the thing that sits at the centre of the stack, not at its edge.

The losses are real but bounded:

- **Wiki-graph atelier:** gone as a native feature. If Kaanu decides later that the linked-prose shape is central, Path A can be introduced at that point, with Quartz added as a second site rather than replacing anything. The Omeka S investment is not wasted.
- **Authoring ergonomics:** Obsidian still used privately, so curators do not change tools. The publishing step becomes more deliberate (run a script, review, push) rather than a reflex (git push). This is actually a small editorial win for a collective that cares about what gets published.
- **Design flexibility:** more up-front designer work on the Omeka S theme. This is a Phase 0 cost, done once.

The gains are also real:

- **One system.** Every maintainer knows where everything is.
- **One URL space.** No sub-domain trickery, no dual navigation, no "which half is this on" question for visitors.
- **Member accounts, contributions, annotations, comments, selections:** all native, rather than bolted onto one half and stubbed on the other.
- **Charter and centre pages benefit from being near the collection,** not in a separate intellectual neighbourhood.
- **Succession is easier:** one handover document, one runbook, one set of admin accounts.

### 7.1 If you choose Path A anyway

There are good reasons to stay on Path A. If you do:

- Keep the two systems genuinely aligned in visual identity. A visitor should not notice which one they are on.
- Script the cross-link bookkeeping. Every bibliography mention in the atelier should resolve to an Omeka S item URL automatically, not via hand-edited markdown.
- Name two maintainers explicitly and share load. A single-maintainer Path A will slip.
- Revisit in year two: if the atelier has grown into a living wiki with many internal links and active readership, the overhead is paying off. If the atelier sits quietly with a handful of pages that could have been Omeka S Pages, fold it in.

### 7.2 If you choose Path B

- Invest up front in theme design. The whole public face of Kaanu will be Omeka S; it needs to look like Kaanu, not like a default Omeka S install.
- Build the Obsidian-to-Omeka publishing pipeline early. Even a small script saves accumulating frustration.
- Use Exhibits generously. Every essay that would have lived on the atelier is an Exhibit candidate. This is a habit change for curators, worth acknowledging.
- Keep kaanu.daktre.com as the primary URL and do a careful 301 redirect map from current Quartz paths to their new Omeka S homes, so existing links and search-engine indexing survive the migration.

## 8. Bottom line

Are both needed? Strictly, no. Omeka S alone can carry the ambitions the plan describes, with a one-way Obsidian publishing pipeline handling the authoring side. Quartz alone cannot.

The remaining question is whether the particular shape of the current Quartz atelier (wiki-feel, backlinks, linked prose) is itself a part of Kaanu's intellectual identity, worth the cost of a second system. If yes, Path A. If no, Path B, which is my current recommendation on the balance of evidence.

This is a live decision, not a settled one. It can be made more confidently after a short audit of what currently lives on the atelier and whether those pages genuinely need the wiki-shape to do their work.
