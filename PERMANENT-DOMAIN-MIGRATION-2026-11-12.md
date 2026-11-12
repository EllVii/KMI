# KMI Permanent Domain Migration — 2026-11-12

## Decision
Kingdom Missions International's permanent authoritative public domain is:

**https://kingdommissionsglobal.org**

The apex hostname is the preferred canonical/search identity. `www.kingdommissionsglobal.org` remains an accepted alternate hostname for infrastructure and security verification.

## Migration scope prepared
This branch moves search/entity authority from the legacy GitHub Pages project URL to the permanent KMI domain without changing the protected operational systems.

### Updated
- static canonical URLs on indexable public pages
- Open Graph URLs and images
- Twitter sharing image URLs where they used the legacy host
- shared `assets/app.js` site base used by canonicals and JSON-LD
- Organization / WebSite / WebPage / Breadcrumb structured-data URLs
- `robots.txt` sitemap location
- `sitemap.xml` page and image URLs
- sitemap lastmod dates for the metadata migration
- README domain/search architecture documentation

### Intentionally unchanged
- staff/admin/C-Panel authentication
- sessions, roles, permissions, or tokens
- Turnstile verification logic
- CRM inquiry forwarding logic
- CRM ingest secrets
- Givebutter widget IDs, payment processing, or webhooks
- service-worker cache/security boundaries
- public page paths
- internal relative links
- PWA manifest relative scope/start behavior
- legacy GitHub Pages availability

## Why this is one coordinated change
The search-authoritative hostname must stay synchronized across:
- HTML canonicals
- rendered/dynamic canonicals
- structured data
- social preview URLs
- robots.txt
- sitemap.xml
- search-console properties
- external backlink targets

Changing only one of these layers would create mixed authority signals.

## Release gate
Before publishing this branch to `main`, verify externally that:
1. `https://kingdommissionsglobal.org/` resolves and serves the KMI production site over valid HTTPS.
2. critical public pages such as `/about.html`, `/resources.html`, `/outreach.html`, `/fellowship.html`, `/give.html`, `/faq.html`, `/connect.html`, and `/privacy.html` return the intended content.
3. `/api/crm/config` remains available only through the intended Worker path and does not expose secrets.
4. the secure inquiry path is tested on the permanent hostname with Turnstile and the private CRM bridge.
5. `www` behavior is decided. Recommended: redirect public GET/HEAD traffic to the apex hostname while preserving API behavior unless the infrastructure already performs that redirect safely.

## After release
- add/verify the domain-prefix or Domain property in Google Search Console
- submit `https://kingdommissionsglobal.org/sitemap.xml`
- inspect Home, About, Resources, Education, Outreach, Fellowship, Give, FAQ, Connect, Media, and Privacy
- use Google's Change of Address workflow for applicable old properties/domain variants
- update Ell Vii's Automations KMI case-study backlink to the permanent domain
- update legitimate partner/directory/media links as relationships are confirmed
- monitor indexing, canonical selection, branded queries, and same-name entity confusion
- preserve the GitHub Pages URL only as a legacy/fallback location, not as competing canonical authority

## Cause → effect
**Cause:** KMI's secure operational architecture already recognizes `kingdommissionsglobal.org`, while search canonicals still point to the GitHub Pages project URL.

**Change:** consolidate all search/entity URL signals on the permanent KMI domain.

**Expected effect:** stronger CI, SEO, SXO, AEO, GEO, AIO, PR, and CMA alignment; clearer organization disambiguation; cleaner future app/store association; less split authority between KMI and the Ell Vii GitHub namespace.

## Risk control
Do not merge if the permanent domain cannot be verified as serving the production public site. A canonical URL that does not resolve or does not serve equivalent content would create a larger SEO/CX problem than the legacy GitHub Pages canonical.
