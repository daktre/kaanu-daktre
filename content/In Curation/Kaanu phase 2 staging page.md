**Last updated:** 2026-04-25
*Post-discussion with ASD & WS on 20 and 21 April.*

### 1. [[Kaanu phase 2 plan]] 

The current plan. What Kaanu is, what is being built, and the five sub-phases of Phase 2 (URL layer on pilot, legacy 843 migration, incoming 1000+ PDFs, Zenodo DOI registration with capture of any pre-existing DOI, static site and domain cutover). Visualisation is deferred to Phase 3. Supersedes every earlier planning document.

### 2. [[Kaanu Documentation]]

Operational reference for running Kaanu. Periodically updated.

- **[[Kaanu deployment log]]** Authoritative record of what was done on the droplet during trial and early deployment.
- **[[Kaanu credentials template]]:** Where each secret lives and how it is rotated.
- **[[Kaanu archivist handbook]]:** Identifier scheme, canonical URL rule, redirect policy, ledger columns, editorial workflow.
- **[[Kaanu migration README]]:** How to regenerate the inventory and what still needs manual work.
- **[[Kaanu deployment scripts]] Droplet create, setup, certbot, Spaces configure.

## To be done

- **Charter** for membership.
- **Member directory.** Shortlist of Adivasi members, Adivasi scholars, and non-Adivasi allies to invite at soft-launch.
- **Events page.**
- **Commentary, call for subs, etc.**

## Questions still open

Five decisions flagged in the current plan, listed here for visibility.

1. Starting value for the Kaanu identifier counter (`kb000001` from zero, or leave room for legacy IDs?).
2. Static site engine for `kaanu.org` (Astro recommended; 11ty and Hugo are alternatives. WordPress is on the table per ASD's recommendation given the events page and the blog / commentary that will interpret the collection).
3. Charter draft, with Pushpaja and Werner.
4. Mail provider for `contact@kaanu.org` on day one (or a contact form pointing at a personal inbox?).
5. Zenodo's position on minting new DOIs for documents that already have a publisher DOI. Akshay's email on Zenodo's fair-usage policy is the prompt; the safest path is to write to Zenodo for an upfront agreement on the Kaanu use case before the first batch run.

The earlier [archived planning page](https://claude.ai/local_sessions/HISTORICAL_PLANNING.md) consolidates the reasoning behind the current plan.

## Reasoning archive

[HISTORICAL_PLANNING.md](https://claude.ai/local_sessions/HISTORICAL_PLANNING.md) holds the original unified plan, the Quartz-vs-Omeka evaluation, the integrated platform plan, the submission pipeline, the trial install walkthrough, and three smaller migration sub-plans. Each section flags what survives and what was superseded. Originals sit under `archive/` for anyone who needs the full text.