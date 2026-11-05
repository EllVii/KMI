# Kingdom Missions International Website

Production-oriented public website and PWA foundation for Kingdom Missions International (KMI), a Las Vegas-based Christian ministry.

## Public experience

The site currently includes:

- Home and About
- Community Resources
- Faith-Based Education
- Outreach and Fellowship
- Ministry Areas
- Giving through Givebutter
- Questions & Answers
- Media & Partnerships
- KMI Connect
- Website Privacy
- Installable PWA behavior for public informational content

## Current architecture

- Static HTML/CSS/JavaScript public experience
- Cloudflare Worker entry point in `src/index.js`
- Static assets served through the Worker `ASSETS` binding
- Givebutter donation widgets and webhook transport
- Optional website-to-private-CRM inquiry bridge
- Cloudflare Turnstile verification before enabled online inquiries are forwarded
- Email fallback when the secure online inquiry path is unavailable
- GitHub Actions syntax validation for the public inquiry frontend/backend scripts

## Public inquiry safety boundary

The public `connect.html` form is progressive enhancement. It remains hidden unless the required Worker configuration is present and Turnstile can load.

Required Worker configuration:

- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `KMI_CRM_URL`
- `KMI_CRM_INGEST_TOKEN`

The browser posts only to the website's `/api/crm/inquiry` route. The Worker validates the request and Turnstile result, then forwards the approved inquiry server-side to the private CRM integration endpoint. The CRM ingest token must never be placed in public HTML, browser JavaScript, or committed configuration.

The existing email links remain available if the online integration is disabled or unavailable.

## Protected boundary

Do not treat `noindex` as authentication. Staff/admin/C-Panel access, private CRM permissions, sessions, roles, tokens, donor records, and other protected operations require their own authenticated boundary.

Public website changes must not silently alter those systems.

## Search and domain status

The current repository still uses the GitHub Pages URLs in canonical tags, structured data, robots.txt, and sitemap.xml.

`kingdommissionsglobal.org` is already referenced by the secure inquiry architecture, but the search-authoritative hostname should not be switched piecemeal. When the permanent custom-domain cutover is externally verified, update canonicals, sitemap, robots, structured data, social URLs, Search Console, redirects, app association, and backlink targets together.

## Privacy and payments

- Do not store card, bank, or cryptocurrency credentials in the KMI public site.
- Givebutter handles approved online donation payment entry.
- The optional inquiry form may collect contact and message information for private follow-up when enabled.
- See `privacy.html` for the current public data-flow explanation.
- Do not submit highly sensitive or emergency information through the ordinary website inquiry form.

## Legal / program-language note

Final claims involving 508(c)(1)(A), religious organization status, tax treatment, counseling services, accreditation, education credentials, or other regulated/legal representations should be reviewed by qualified professionals and kept synchronized with KMI's approved public statements.

## Development

Built and maintained with technology support from Ell Vii's Automations.

Website: https://ellviisautomations.com
