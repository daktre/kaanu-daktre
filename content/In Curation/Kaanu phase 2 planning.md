This is a "staging" area to plan for phase 2. The goal at this stage is to get all the thinking in one place so all actors involved can get a shared idea. 

**Last updated:** 2026-04-18
**Status:** Staging. Read-only planning material.
## Current documents
### 1. [[Kaanu Integrated Platform]]

Idea of a single domain kaanu.org with three components: landing page, an [Omeka S](https://omeka.org/s/) archive, and a [Quartz-generated graph layer](https://quartz.jzhao.xyz) rebuilt from Omeka's data (now). In future, the pipeline will involve docs going first on the Omeka S Archive rather than directly on Quartz. 
### 2. [[Kaanu pipeline]]

==To be updated:== How a document gets identified, captured, triaged, enriched, deposited, announced, and interacted with. Zotero as the capture tool for bibliographic items, direct-to-Omeka for non-bibliographic material, Contribution module for ally submissions, controlled vocabularies for subject/community/region/era. Roles for the three member categories. Public browse and search without login; contribute, annotate, comment, and save only with login.

### 3. [[kaanu bibliography migration]]]

==To be updated:== Step-by-step for moving the existing Quartz bibliography into Omeka. Routes both kinds (WIKINDX-exported and hand-written-with-PDFs) through Zotero as a staging area. Includes the `md_to_bibtex.py` and `csv_to_bibtex.py` conversion scripts, the CSV Import trial, the Zotero Import module switchover, SQL verification queries, and an nginx redirect map preserving old URLs.

Intact. Runs in Phase 2 of the integrated platform plan.

## Historical documents

Kept for context. Each is flagged at the top with how it has been superseded. If you are coming in fresh, you can skip these, but they make the reasoning behind the current plan visible.

### 4. [Original unified plan](kaanu%20plan%20(OLD).md)

The first attempt at bringing together curation, archive, membership, and the BR Hills centre under one plan. Recommended keeping Quartz for the atelier and Omeka for the archive, under one domain. Superseded in architecture by the integrated platform plan, but its sections on charter, membership, and the centre still hold.

Status: superseded. Charter, membership, and centre sections still current. Architecture section replaced by [[Kaanu Integrated Platform]]

### 5. [[kaanu evaluation]]

A second-look document that tested the "two parallel systems" assumption. Concluded that Omeka alone could carry the ambition, and recommended Path B (Omeka only, with a one-way Obsidian-to-Omeka publishing pipeline for authoring).

Status: the evaluation's logic still holds as a useful reasoning record, but its Path B recommendation is superseded by what the integrated platform plan calls Path D: Omeka as source-of-truth, Quartz as a derived view rebuilt from Omeka's data. Path D keeps Path B's single-authoring-system simplicity while recovering the graph feel that Path A wanted.

## PENDING

- [ ] **Charter text.** Currently noted as "in preparation" by the initiator.
- [ ] **Member directory seed.** Shortlist of Adivasi members, Adivasi scholars, and non-Adivasi allies to invite at soft-launch.
- [ ] **Visual identity brief.** Colour, typography, header/footer spec that will be applied to the landing page, the Omeka theme, and the Quartz theme.
- [ ] Revisit the [[kaanu plan (OLD)]] which still has stuff to rejig


Five decisions flagged in the integrated platform plan that are cheap to resolve now and expensive to resolve mid-Phase-1:

1. Droplet size on day one: 2 vCPU / 4 GB or 1 vCPU / 2 GB?
2. Object storage: Backblaze B2 or DigitalOcean Spaces?
3. Email: contact@kaanu.org on day one or a contact form pointing at a personal inbox?
4. Charter draft timeline: ready, in preparation, or co-authored by the founding cohort?
5. Initial member cohort: shortlist at launch or post-soft-launch?

