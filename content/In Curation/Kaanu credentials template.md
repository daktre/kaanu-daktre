
**SECURITY NOTE**

This is a template. Paste the real values in from your existing `~/.config/kaanu/kaanu-credentials.txt` (or wherever you stored the dump that `deploy.sh` pulled off the droplet), then either:

- move this file into a password manager (1Password, Bitwarden, KeePassXC) and delete this markdown copy, OR
- keep the file locally at `~/.config/kaanu/kaanu-credentials.txt` with `chmod 600` and an encrypted disk.

Do not commit this filled-in file to git. Do not paste the filled-in version into chat, issue trackers, or any cloud-synced folder that is shared.

---

## 1. Droplet access

|Field|Value|
|---|---|
|Droplet name|`kaanu`|
|Region|`blr1` (Bangalore)|
|Public IP|`168.144.66.105`|
|System user|`daktre`|
|System user password|`<paste from kaanu-credentials.txt, field "SYSTEM_PASS">`|
|Root password|`<paste from kaanu-credentials.txt, field "ROOT_PASS">`|
|SSH private key path (on Mac)|`~/.ssh/id_ed25519`|
|SSH public key path|`~/.ssh/id_ed25519.pub`|
|SSH command|`ssh -i ~/.ssh/id_ed25519 daktre@168.144.66.105`|
|`sudo` password|Same as system user password|

Once SSH hardening is applied (step 1 of next phase), password login will be disabled; the SSH key becomes the only way in. The passwords still matter for sudo on the droplet and for DO console recovery.

## 2. Database

|Field|Value|
|---|---|
|Engine|MySQL|
|Host|`localhost` (from within the droplet)|
|Database name|`omeka`|
|DB user|`omeka`|
|DB password|`<paste from kaanu-credentials.txt, field "DB_PASS">`|
|MySQL root password|`<paste from kaanu-credentials.txt, field "MYSQL_ROOT_PASS">`|
|Config file on droplet|`/var/www/omeka/config/database.ini`|
|Direct connection test|`sudo mysql omeka -u omeka -p`|

## 3. Omeka S admin

|Field|Value|
|---|---|
|Admin URL|`https://new.kaanu.org/admin`|
|Admin email|`<email you typed into the installer form>`|
|Admin password|`<what you typed into the installer form>`|
|Site slug|`<paste the slug you picked, probably "kaanu">`|

Not in the credentials file. You chose these in the browser during the installer step. Write them here now, while you still remember.

## 4. DigitalOcean account

|Field|Value|
|---|---|
|DO API token|`<paste current token, or "stored in ~/.config/kaanu/do.env">`|
|DO Spaces access key (when created)|`<leave blank until you run configure-spaces.sh>`|
|DO Spaces secret|`<leave blank until you run configure-spaces.sh>`|
|Spaces region|`sgp1` (Singapore)|
|Spaces bucket name|`<leave blank until you create it, e.g. "kaanu-files">`|

## 5. Domain

|Field|Value|
|---|---|
|Registrar|GoDaddy|
|DNS nameservers|`ns15.domaincontrol.com`, `ns16.domaincontrol.com`|
|A record|`new.kaanu.org` -> `168.144.66.105`|

Login to the GoDaddy account is managed separately (your usual GoDaddy login); the registrar credentials should stay in your password manager, not in this file.

## 6. Let's Encrypt

Certificate issued for `new.kaanu.org`. Auto-renewal runs via systemd timer `certbot.timer`. No manual action needed; first renewal attempt happens 30 days before expiry.

Certificates live at `/etc/letsencrypt/live/new.kaanu.org/` on the droplet. Nothing to record here.

## 7. Zenodo

Required from Phase 2D onwards for canonical DOI minting. Every Kaanu record is deposited to the Kaanu community on Zenodo, which mints a DataCite DOI.

|Field|Value|
|---|---|
|Zenodo account email|`<paste, probably contact@kaanu.org or your founder address>`|
|Zenodo personal access token|`<paste; created at zenodo.org/account/settings/applications/tokens/new/>`|
|Token scopes|`deposit:write`, `deposit:actions`|
|Kaanu community identifier|`<paste; created once via Zenodo UI, e.g. "kaanu">`|
|Token storage|Same credentials file as the Omeka API key, on Mac only|

The token should be created from the Kaanu Zenodo account, not a personal account, so it is portable across maintainers. Rotate every 12 months or immediately if exposed.

`mint_zenodo_dois.py` reads the token and community identifier from the credentials file (or environment variables) and uses them on every deposit. `record_other_dois.py` does not need any Zenodo credential because it only writes to the local Omeka database via the existing API key.

## 8. Optional / future

|Service|When you need it|
|---|---|
|Zotero API key|Only needed if you use the Zotero Import module (server-side import). For CSV export, not needed.|
|VIAF / LCSH / AAT API keys|Not required. Value Suggest endpoints are public.|
|Backblaze B2 account|When you set up off-provider backups (recommended before Phase 2 community data)|

---

## Rotation schedule (suggested)

- **SSH key:** rotate every 12 months
- **System user password:** rotate if you ever type it on an untrusted machine
- **DB user password:** rotate if the credentials file ever leaves your control; update `/var/www/omeka/config/database.ini` to match
- **DO API token:** rotate every 6 months; `do.env` is the only place it lives on your laptop
- **Omeka admin password:** rotate every 6 months, or immediately if shared
- **Zenodo personal access token:** rotate every 12 months, or immediately if exposed; only the new token needs to land in the credentials file

## Backups of this file

This file is the single point of failure for the staging site. Store one copy in your primary password manager and a second copy in an encrypted backup (Time Machine on an encrypted disk, or a keyfile-protected zip in Backblaze). Do not keep it in plain text in a synced cloud folder.