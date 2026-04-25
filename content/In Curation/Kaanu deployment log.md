

Status as of 25 April 2026. This is a plain-English record of what is now running, where it is, how to get to it, and what was installed during the trial deployment. Keep this alongside your credentials file.

## What exists now

A DigitalOcean droplet in Bangalore (`blr1`) running Omeka S 4.2 at `https://new.kaanu.org`, with HTTPS from Let's Encrypt. The droplet is your Phase 0 staging platform. Phase 1 content work (bibliography migration from Zotero) can start on it.

### Droplet summary

|Item|Value|
|---|---|
|Public IP|`168.144.66.105`|
|Region|`blr1` (Bangalore)|
|Size|`s-2vcpu-4gb` with 2 GB swap|
|Backups|DigitalOcean weekly backups enabled|
|Monitoring|DO monitoring agent enabled|
|OS|Ubuntu 24.04 LTS|
|Web server|nginx 1.24|
|PHP|8.3-FPM|
|Database|MySQL (local, `omeka` database, `omeka` user)|
|TLS|Let's Encrypt via certbot, auto-renewed by systemd timer|
|SSH|`ssh -i ~/.ssh/id_ed25519 daktre@168.144.66.105` (key-only, root login disabled)|

### URLs

|URL|Purpose|
|---|---|
|`https://new.kaanu.org`|Public site (Omeka S front end)|
|`https://new.kaanu.org/admin`|Omeka admin (login with the admin email + password you set during installer)|
|`https://new.kaanu.org/admin/module`|Module list|
|`https://new.kaanu.org/s/kaanu`|The Kaanu site view (depends on the slug you chose)|

### DNS

Currently managed at **GoDaddy** (nameservers `ns15.domaincontrol.com` / `ns16.domaincontrol.com`).

|Record|Value|
|---|---|
|`new.kaanu.org` A|`168.144.66.105`|
|`kaanu.org` (apex)|Untouched, still points to your existing Manifold site|

No CDN or reverse proxy sits in front of `new.kaanu.org`, and nothing should during TLS issuance or renewal.

## Omeka S modules installed

Eight modules from the original plan are active. One (Mapper) is held back as optional. Three (Annotate, Comments, MetadataBrowse) had no zip release available at install time and can be cloned from GitHub later if needed.

|Module|State|Purpose|
|---|---|---|
|CSV Import|Active|Bulk import of Zotero CSV into Omeka items|
|Value Suggest|Active|Autocomplete from authority vocabularies (VIAF, LCSH, AAT)|
|Collecting|Active|Community submission forms|
|Zotero Import|Active|Direct Zotero API import (alternative to CSV)|
|Common|Active|Dependency for Daniel-KM module family|
|Advanced Resource Template|Active|Custom field types; dependency for Contribute|
|Contribute|Active|Public contribution workflows|
|Selection|Active|User-curated reading lists|
|Mapper|_Optional, not installed yet_|Authority autofill (IdRef, Geonames)|

Three modules from the original plan were **not** pre-installable because their current releases do not publish a zip asset: **Annotate**, **Comments**, **MetadataBrowse**. These are not needed for Phase 1 content migration. If you want them later, clone from GitHub into `/var/www/omeka/modules/` and install from the admin UI.

## Deployment artefacts

All four deployment scripts live at `/sessions/eloquent-dazzling-noether/mnt/Kaanu/infra/` on your laptop:

|File|Purpose|
|---|---|
|`deploy.sh`|Creates the droplet from your laptop|
|`setup.sh`|Runs on the droplet (called by deploy.sh); installs LEMP, MySQL, Omeka S|
|`certbot.sh`|Runs on the droplet after DNS is pointed; issues the TLS certificate|
|`configure-spaces.sh`|Runs on the droplet when you want to move file storage to DO Spaces|
|`do.env.example`|Template for the DO API token file|
|`README.md`|How to use the scripts|

The scripts have been cleaned to be DNS-provider-agnostic (they no longer assume Cloudflare). If you rebuild the droplet from scratch you can run them as-is against GoDaddy, Route53, or any provider you like.

## What changed from the original plan during deployment

Three fixes that were discovered during trial and hard-coded into the scripts:

1. **Omeka S zip extracts to `omeka-s/`** (not `omeka-s-<version>/` as the release filename implies). `setup.sh` now detects the real extracted directory name.
2. **`database.ini` format** has no section header, and the username field is called `user`, not `username`. `setup.sh` now writes the correct format.
3. **nginx deny rule** does not block `/application/` because that is where Omeka's own CSS/JS lives. Only `/config/`, `/logs/`, and `/data/` are denied.

One in-place fix on the running droplet that is not yet in the scripts:

- Omeka S was upgraded from 4.1.1 to 4.2.x in-session so the newer Value Suggest could install. If you rebuild from scratch you should update `setup.sh` to pull 4.2.x directly.

## Open items

Low priority, no immediate blocker:

- Remaining modules (Annotate, Comments, MetadataBrowse) to install via git clone if needed later
- `setup.sh` could be updated to pull Omeka S 4.2.x directly so future rebuilds skip the in-place upgrade
- DigitalOcean Space for file storage (`configure-spaces.sh`) not yet run. Fine for Phase 0; run before the platform holds real community uploads.
- Second-factor backup to Backblaze B2 or equivalent. DO weekly backups are on, which is enough for staging.
- Local migration workbench now exists at `/Users/prashanthns/Documents/Claude/Projects/Kaanu/migration/`, including a generated Quartz inventory for the first bibliography migration pass.

## Order of work done so far

1. Droplet created (`blr1`, `s-2vcpu-4gb`, backups on)
2. LEMP stack installed
3. Omeka S 4.1.1 downloaded and configured
4. MySQL database and user created
5. nginx vhost installed and enabled
6. DNS A record added in GoDaddy, propagation verified
7. Let's Encrypt certificate issued and auto-renewal verified
8. Omeka installer completed in browser (admin user created, site created)
9. nginx deny rule corrected to stop blocking Omeka's CSS
10. Omeka S upgraded to 4.2.x
11. Eight modules installed in dependency order: CSVImport, Collecting, ZoteroImport, Common, AdvancedResourceTemplate, Contribute, Selection, ValueSuggest
12. Credentials pulled off the droplet to the Mac; on-droplet copy shredded
13. SSH hardened: root login disabled, password authentication disabled, key-only access for `daktre`