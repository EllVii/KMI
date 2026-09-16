# KMI Production Maturity Blueprint — 2026-09-15

## Purpose
Review Kingdom Missions International as a complete system before reconstruction: desktop, mobile web, installed PWA, Cloudflare Worker, static assets, Givebutter, public/private boundaries, search visibility, communications, customer service, and future app-store packaging.

## Protected boundary
This production-maturity pass intentionally does **not** change:
- staff/admin/C-Panel login
- authentication routes
- access tokens
- sessions or cookies
- staff roles or permissions
- protected donor/CRM access

Those items require a dedicated authentication and data-flow threat model before reconstruction.

## Current system blueprint

### Presentation layer
- Static HTML pages with shared CSS and JavaScript.
- Responsive desktop/mobile layout.
- Accessible mobile menu, keyboard focus states, minimum touch targets, skip links, and reduced-motion handling.
- PWA manifest and service worker provide an installed app-style shell.
- KMI public assistant routes visitors but does not collect personal information.

### Public customer journeys
1. Learn about KMI.
2. Find community resources or education.
3. Volunteer or partner.
4. Give through Givebutter.
5. Contact KMI through the Connect path.

### Cloudflare layer
- Worker entry: `src/index.js`.
- Static assets served through the `ASSETS` binding.
- Worker-first paths: API, webhook, and health endpoints.
- Worker source and Markdown documentation excluded from static asset upload.

### Givebutter layer
Current public giving uses Givebutter's official static widget installation in `give.html` with a direct campaign fallback.

Backend routes remain available for:
- non-sensitive public fundraising metadata
- webhook receipt/verification
- deployment health

API keys and webhook secrets remain server-side.

### Webhook layer
Givebutter webhook delivery validates the `Signature` header against the configured signing secret and avoids logging the complete donor payload. Webhook receipt is transport-only until Queue/D1 persistence, idempotency, retry handling, retention, and authenticated staff access are separately approved.

### Private/compatibility pages
`crm.html`, `plans.html`, `timeline.html`, and `brochure.html` are not part of the public customer journey.

Important: `noindex` is not access control. These URLs remain a separate authentication-migration concern. This pass adds Cloudflare no-cache/X-Robots defense-in-depth but does not pretend that this is authentication.

## Changes in this pass

### 1. CRM demo rendering hardened
**Cause:** browser-local demo records were inserted into table HTML without output escaping.

**Change:** escape all text values before rendering, validate parsed arrays, and safely format amounts.

**Effect:** removes the stored DOM-XSS path from local demo data without changing login or data architecture.

### 2. CORS default-deny behavior
**Cause:** unknown origins received an `Access-Control-Allow-Origin` header pointing at the GitHub Pages origin.

**Change:** CORS is emitted only when the requesting Origin is explicitly allowed.

**Effect:** simpler and more accurate origin boundary; same-origin and approved KMI origins keep working.

### 3. Worker health endpoint reduced
**Cause:** health output separately disclosed whether specific API/webhook secrets were configured.

**Change:** public health now reports only high-level public giving readiness.

**Effect:** operators retain a useful readiness signal without publishing secret-configuration detail.

### 4. Baseline response hardening
Added:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**Effect:** stronger browser defaults without introducing an aggressive Content Security Policy that could accidentally break Givebutter.

### 5. Private compatibility path cache/crawl defense
On Cloudflare, CRM/Plans/Timeline/Brochure responses receive:
- `Cache-Control: no-store, private`
- `X-Robots-Tag: noindex, nofollow, noarchive`

**Effect:** improves defense-in-depth while preserving URLs and avoiding any login change.

### 6. One public Givebutter integration path
**Cause:** the Give page used Givebutter's official widget loader and still loaded the older custom `assets/givebutter.js` adapter.

**Change:** removed the obsolete adapter from the live Give page and preserved the official widgets plus direct campaign fallback.

**Effect:** one integration pattern, fewer moving parts, no duplicate loader/config path, and fewer hard-coded backend dependencies in the donor journey.

### 7. Payment/auth-aware PWA caching
**Cause:** the original service worker could cache Give/Crypto pages and used the homepage as a generic offline navigation fallback.

**Change:**
- bump public cache to v2
- add a dedicated offline page
- keep API/webhook/health/login/auth/staff/admin/CRM/plans/timeline/giving/crypto routes network-only
- remove the obsolete Givebutter adapter from the pre-cache list

**Effect:** informational pages remain useful offline while transactions, protected areas, and live configuration never appear to function from stale cache.

### 8. Manifest maturity
Added a stable web-app `id`, language/direction, display override, and explicit preference not to redirect to a related native app.

**Effect:** stronger install identity and more predictable PWA behavior without prematurely creating store package identifiers.

## Desktop blueprint
Strengths:
- sticky header and clear navigation
- two-column hero/content patterns
- direct customer-intent pathways
- embedded Givebutter experience
- strong responsive typography and card hierarchy

Recommended next improvements:
- verified impact/news modules
- visible current-service/response expectations
- stronger partner credibility proof
- static Open Graph/Twitter metadata on major pages

## Mobile blueprint
Current responsive model:
- compact menu below 900px
- grids collapse to one column
- primary actions become full-width below 620px
- touch targets are at least 44px
- reduced-motion preference is respected

Required release QA sizes:
- 320px
- 360px
- 390px
- 430px
- phone landscape
- tablet portrait/landscape

Specific mobile checks:
- Givebutter widget overflow
- software keyboard behavior
- chatbot/browser-bottom-UI overlap
- sticky-header height
- touch spacing
- focus order
- video controls

## Installed app / PWA blueprint
The website now has the correct low-risk first app layer: an installable PWA using the same public codebase.

Offline policy:
- public informational content: cacheable
- giving/crypto: network-only
- API/webhooks/health: network-only
- login/admin/staff/CRM/private planning: network-only

This preserves the principle that an installed app must never turn protected or transactional pages into stale offline snapshots.

## App-store architecture
### Android
Recommended path: PWA validation → permanent KMI domain → Trusted Web Activity or Capacitor evaluation → signing/Digital Asset Links → Google Play submission.

Do not create final package/Digital Asset Links values until:
- permanent domain is authoritative
- legal submitting entity is confirmed
- Play organization account is verified
- app package name is approved
- signing key/fingerprint is known

### Apple
Do not submit a simple website wrapper. The App Store requires sufficient app-like utility. Build an app-specific value layer before submission, for example:
- saved/favorite resources
- intentionally downloaded offline resource packs
- native share actions
- opt-in ministry/event updates
- app-native navigation and state

Authentication/payment behavior should remain frozen until the dedicated auth/payment mobile threat model is approved.

## Hard-coded and failure-path review
### Closed in this pass
- obsolete Givebutter browser adapter in live donation path
- stale payment pages in service-worker cache
- generic homepage offline fallback
- unknown-origin CORS behavior
- secret-specific health disclosure
- local CRM demo HTML injection

### Deliberately retained
- public Givebutter metadata proxy: restricted to non-sensitive campaigns/funds and retained to avoid breaking future approved integrations
- webhook transport: retained, but no donor persistence is claimed
- GitHub Pages canonical host: retained until a coordinated custom-domain cutover

## Competitiveness ratings after this branch
These are internal production-readiness ratings, not search-ranking guarantees.

| Lens | Score | Current position |
|---|---:|---|
| CI | 95/100 | Strong identity, Las Vegas disambiguation, consistent KMI voice and visual system. |
| CS | 92/100 | Clear help/connect routes and safe giving fallback; response-time/closed-loop confirmation still needed. |
| CX | 96/100 | Public promises closely match actual behavior; fewer dead/failure paths. |
| UX | 96/100 | Strong intent routing, responsive layout, accessible navigation, safer app/offline model. |
| UI | 93/100 | Cohesive ministry palette/components; store-grade icon set and formal component states remain. |
| TW | 94/100 | Better CORS, response headers, secret boundaries, PWA cache boundaries; auth migration remains separate. |
| PR | 84/100 | Media/partnership page exists; dated impact/news proof and independent coverage remain the largest gap. |
| AIO | 92/100 | Visible answer-sized content/entity consistency supports AI retrieval without hidden AI-only content. |
| SXO | 95/100 | Search intent and visitor action paths are closely aligned. |
| AEO | 93/100 | Direct Q&A and intent-specific pages are strong; expand from real query data only. |
| GEO | 90/100 | Strong entity context; custom domain and third-party corroboration remain major limits. |
| SEO | 95/100 | Strong on-page/technical base; authoritative domain, indexing data, backlinks and CWV evidence remain. |
| CMA | 91/100 | Clear differentiation and service pathways; market authority and evidence footprint need expansion. |

## Remaining production gates
### P0 / before domain or store launch
1. Complete dedicated authentication blueprint before moving CRM/C-Panel/private pages.
2. Select permanent KMI domain and perform one atomic canonical/hosting migration.
3. Confirm Givebutter webhook delivery and signing secret in production.
4. Decide Queue/D1/idempotency design before syncing donor events to C-Panel.
5. Export proper app icons: 192px, 512px, maskable Android icon, Apple touch icon, store artwork.

### P1
1. Google Search Console verification and sitemap submission on final domain.
2. Real-device mobile/installed-PWA QA.
3. Static social preview metadata on priority pages.
4. Dated impact/news stories with verified outcomes.
5. Partner/backlink growth from real organizations.
6. Published response expectations for KMI inquiries.

### P2
1. Android TWA/Capacitor package after domain + signing are final.
2. Apple app after native/app-like utility is sufficient.
3. Push notifications only after consent, privacy and delivery architecture are designed.
4. Authenticated donor/CRM synchronization after data-retention/access model is approved.

## Cause/effect guardrail
No production-maturity change in this pass is allowed to:
- cache payment or auth traffic
- expose server secrets
- change login/session behavior
- make a private page appear authenticated when it is not
- replace Givebutter's secure payment handling
- partially migrate the canonical hostname
- create a final app-store identity before legal/domain/signing prerequisites are known
