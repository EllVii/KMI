# KMI Blueprint Audit — 2026-09-14

## Purpose
Review KMI as a complete system before reconstruction: public website, Cloudflare Worker, Givebutter widgets/API/webhooks, mobile behavior, future app packaging, SEO/AEO/GEO/CMA/PR, and security boundaries.

This audit intentionally does **not** change authentication, C-Panel login, staff tokens, or other login wiring. Those remain a protected subsystem until a separate authentication blueprint is approved.

## Executive blueprint

### Current public presentation layer
- Static HTML pages with shared CSS and JavaScript.
- Current canonical/indexing system still points at the GitHub Pages KMI URL.
- Main public paths: Home, About, Resources, Education, Outreach, Ministry Areas, Give, FAQ, Connect.
- Compatibility/noindex paths: Contact, Get Support, Crypto, Brochure, Plans, Timeline, CRM.
- Responsive CSS already supports desktop, tablet, and mobile layouts.
- Public support assistant is navigation-only and does not collect personal information.

### Cloudflare layer
The repository had diverged into two incompatible deployment models:
1. **main** configured Cloudflare Static Assets but had no Worker entry point.
2. **givebutter-webhook-integration** configured a Worker entry point but omitted Static Assets.

Merging either configuration over the other without reconciliation would break either the public website or the Givebutter backend.

### Givebutter layer
- Donation Button widget created.
- Main Donation Form widget created.
- API key created.
- Webhook created for 10 events.
- Worker routes exist for:
  - /health
  - /api/public-config
  - /api/givebutter
  - /webhooks/givebutter
- Givebutter webhook signing-secret validation is implemented.
- Widget values are designed to come from Cloudflare runtime variables.
- API and webhook secrets must remain server-side.

## Changes made in blueprint reconciliation branch
Branch: `kmi-blueprint-reconcile-2026-09-14`

### 1. Unified Cloudflare architecture
The Worker and Static Assets are now configured together:
- `main: src/index.js`
- static assets served from repository root
- `ASSETS` binding available to the Worker
- Worker-first routing limited to API, webhook, and health paths
- HTML handling and 404 behavior preserved

Cause: static-hosting configuration and Worker configuration had diverged.

Effect: one Cloudflare deployment can serve the public website and backend routes without one replacing the other.

### 2. Protected Worker source files from public asset upload
Added `src` to `.assetsignore`.

Cause: once repository root becomes the static asset directory, Worker source must not be published as a normal browser-accessible asset.

Effect: backend implementation remains runtime code rather than public static content.

### 3. Restricted Givebutter public API proxy
The public proxy is now limited to:
- campaigns
- funds

Removed public access to donor-sensitive resources such as contacts, transactions, recurring plans, payouts, and webhook activity.

Cause: the Worker endpoint is internet-accessible and currently has no C-Panel authentication layer.

Effect: an API key can no longer accidentally turn the public Worker into a donor-data endpoint.

Future C-Panel donor/transaction access must use an authenticated internal route.

### 4. Webhook transport remains separate from donor-data storage
The webhook:
- validates the Givebutter Signature header
- accepts the 10 configured events
- avoids logging full donor payloads
- logs only event type, event ID, and receipt time
- does not yet persist donor or transaction data

Cause: there is no approved D1/Queue persistence and idempotency layer yet.

Effect: Givebutter can safely prove delivery without prematurely building a duplicate-prone CRM sync.

Before C-Panel synchronization, add:
- Queue and/or D1
- event-id idempotency
- retry handling
- minimal normalized storage
- retention policy
- authenticated staff access

### 5. Widget loader diagnostic added
The Worker can now report whether a Givebutter widget library URL is present.

Important: Givebutter widgets require both:
1. widget markup/ID
2. the Givebutter widget library loader tied to the Givebutter account

Supported runtime values:
- `KMI_MAIN_DONATION_BUTTON`
- `KMI_MAIN_DONATION_FORM`
- optional but recommended `GIVEBUTTER_WIDGET_LIBRARY`

If the two widget variables contain only widget IDs/markup and no script-loader URL, add `GIVEBUTTER_WIDGET_LIBRARY` from Givebutter Developers → Widgets → Installation.

### 6. Giving page connected with safe fallback
The Give page now:
- has a Givebutter-powered main CTA
- has an embedded donation form location
- falls back to the public Givebutter campaign if widget initialization fails
- does not expose API or webhook secrets

### 7. Private/unfinished page crawl safeguards
Added static noindex protection to Plans, Timeline, and Brochure.
Also corrected the Timeline favicon reference from a missing SVG to an existing asset.

Cause: some noindex behavior existed only in JavaScript, and one referenced favicon did not exist.

Effect: better crawler safety when JavaScript is unavailable and fewer broken asset requests.

## Plumbing map

### Visitor donation flow
Visitor
→ KMI Give page
→ /api/public-config on KMI Worker
→ public Givebutter widget configuration
→ Givebutter widget library
→ Givebutter-hosted payment experience
→ Givebutter processes payment
→ Givebutter webhook
→ /webhooks/givebutter
→ signature validation
→ currently: receipt/validation only
→ future: Queue/D1
→ future: authenticated C-Panel donor/transaction view

### Failure path
If public-config or widget library fails:
Visitor
→ direct public Givebutter campaign
→ donation remains possible

This prevents the website from becoming a single point of failure for giving.

## Wiring map

### Public/browser-safe values
- KMI_MAIN_DONATION_BUTTON
- KMI_MAIN_DONATION_FORM
- GIVEBUTTER_WIDGET_LIBRARY or equivalent public account loader
- public campaign URL

### Server-only secrets
- GIVEBUTTER_API_KEY
- GIVEBUTTER_WEBHOOK_SECRET

### Values that must never be shipped to frontend JavaScript
- Givebutter API key
- webhook signing secret
- future C-Panel/session secrets
- Cloudflare service credentials
- database credentials

## Known blockers / red flags

### P0 — Branch divergence
The Givebutter branch and main diverged. Direct merging without reconciling `wrangler.jsonc` can remove either the website asset hosting or Worker runtime.

Status: addressed in the reconciliation branch.

### P0 — Runtime variable verification
Cloudflare Build Variables are not equivalent to Worker runtime Variables and Secrets.
Production health must show Givebutter values available to `env.*`.

Required runtime names:
- GIVEBUTTER_API_KEY
- GIVEBUTTER_WEBHOOK_SECRET
- KMI_MAIN_DONATION_BUTTON
- KMI_MAIN_DONATION_FORM
- GIVEBUTTER_WIDGET_LIBRARY (if loader is not embedded in either widget value)

### P0 — Public donor-data API risk
The earlier Givebutter integration branch allowed contacts, transactions, payouts, recurring plans, and webhook activities through a public unauthenticated proxy.

Status: closed in reconciliation branch.

### P1 — Webhook is transport-only
A 200 webhook response does not mean C-Panel synchronization exists.
Persistence, deduplication, and staff-side visibility are still separate work.

### P1 — Social-preview metadata depends heavily on JavaScript
Open Graph and Twitter metadata are generated by `assets/app.js`.
Some social crawlers and messaging preview bots do not execute JavaScript reliably.

Recommendation: progressively move OG/Twitter metadata for major public pages into static HTML during the Cloudflare-domain cutover.

### P1 — Canonical host is still GitHub Pages
This is currently useful while GitHub Pages remains the authoritative public site and prevents temporary Workers preview URLs from competing in search.

At custom-domain cutover, update together:
- app.js siteUrl
- static canonicals
- sitemap
- robots sitemap URL
- JSON-LD URLs
- Open Graph URLs
- Search Console property
- partner/backlink targets

Do not perform a partial hostname migration.

### P1 — Mobile app is not yet an app architecture
The site is responsive, but there is currently no:
- Web App Manifest
- service worker/offline policy
- install UX
- native container
- app-store signing/build pipeline
- deep-link strategy
- push-notification policy

## Desktop / mobile / app blueprint

### Desktop
Keep:
- sticky header
- wide two-column hero patterns
- visible contextual CTA hierarchy
- embedded Givebutter form

Improve next:
- consistent content-width rhythm
- stronger evidence/impact modules
- press/partner credibility strip
- clear donation trust language

### Mobile web
Existing CSS already collapses grids and navigation below 900px and makes CTAs full width below 620px.

Next QA targets:
- 320px, 360px, 390px, 430px widths
- chatbot overlap with browser bottom UI
- donation widget overflow
- keyboard focus through menu and Givebutter iframe/widget
- tap-target spacing
- form completion with software keyboard open
- reduced-motion behavior
- landscape phone behavior

### Installable app / PWA
Recommended first app step:
1. make public site a PWA
2. add manifest
3. add KMI app icons
4. register service worker with conservative caching
5. exclude donation/API/auth endpoints from offline caching
6. test install on Android and iOS
7. preserve all login flows as network-only

This gives an app-like experience without immediately creating two native codebases.

### Google Play
After PWA validation, evaluate a Trusted Web Activity (TWA) or Capacitor wrapper.
Google Play packaging should wait until:
- custom domain is stable
- privacy policy and support URLs are complete
- donation handling complies with store policies
- authentication architecture is frozen
- app icons/screenshots are approved

### Apple App Store
Apple requires an actual app submission, signing, App Store Connect metadata, privacy disclosures, and review.
A Capacitor-based shell is likely the cleanest shared-code path if native distribution is needed.

Do not wrap unstable login/payment architecture merely to obtain an App Store listing.

## CS / CI / CX / UX / UI / TW / PR / SEO review

### CS — Customer Service
Strengths:
- Connect routes visitors by intent
- support assistant avoids collecting personal data
- giving fallback prevents dead ends

Missed opportunity:
- no published response-time expectation
- no visible support-status or service-hours language
- no post-inquiry confirmation workflow

### CI — Corporate/Community Identity
Strengths:
- KMI name, Las Vegas entity context, ministry purpose, colors, and voice are consistent

Risk:
- organization legal/tax wording must remain reviewed and consistent across About, donation receipts, Givebutter, PR materials, and future app-store profiles

### CX
Strengths:
- strong intent routing
- third-party payment trust model

Gap:
- no closed-loop journey after Givebutter donation or Connect email
- no visible donor/volunteer next-step confirmation on KMI itself

### UX
Strengths:
- responsive grids
- compact mobile navigation
- 44px CTAs
- reduced-motion support
- skip link

Gaps:
- several experiences depend on JavaScript for navigation enhancement and metadata
- Givebutter mobile rendering still needs device QA
- no offline/install behavior yet

### UI
Strengths:
- cohesive earth/gold ministry palette
- strong cards and typography
- readable CTA hierarchy

Next:
- formalize KMI design tokens for gold/emerald/onyx across website, Givebutter, C-Panel, and app
- add component states for loading, success, unavailable, warning, and offline

### TW — technical/web trust layer
- preserve clear boundary between browser-safe configuration and secrets
- add security headers only after Givebutter iframe/script requirements are mapped
- do not add an aggressive CSP until all third-party origins are documented
- keep auth/login subsystem frozen until separate review

### PR
Missed opportunities:
- no press/media page
- no approved organization boilerplate
- no downloadable press logo package
- no dated impact/newsroom feed
- no partner recognition page
- no verified media contact role

### SEO
Strong:
- canonical system
- sitemap
- robots
- intent-focused titles
- descriptive internal links

Next:
- custom-domain cutover as one coordinated event
- static social metadata
- Search Console validation
- Core Web Vitals measurement after Cloudflare cutover

### AEO
Strong:
- FAQ page contains direct answer-sized passages

Next:
- expand only from real incoming questions/Search Console queries
- add clear updated/reviewed dates to factual resource content
- keep answers supported and visible to users

### GEO
Strong:
- Las Vegas disambiguation
- organization/entity schema

Next:
- independent corroboration
- consistent custom domain
- dated first-party impact evidence
- verified partner references

### CMA
Largest missed opportunities:
1. custom-domain authority
2. donor trust proof
3. impact/news evidence
4. partner/backlink footprint
5. press-ready facts
6. local resource authority
7. mobile/PWA installability
8. closed-loop donor and volunteer journeys

## SEO / AEO / GEO / PR priority order

### P0
- complete unified Cloudflare deployment
- verify runtime Givebutter values
- confirm widget loader
- verify webhook 200 with signing secret
- keep sensitive Givebutter API data private

### P1
- custom domain migration plan
- static OG/Twitter metadata
- press/partner fact page
- impact/news structure
- Google Search Console
- real-device mobile donation QA

### P2
- PWA
- TWA/Capacitor feasibility
- resource-guide authority expansion
- structured impact data
- app-store preparation

## Protected systems not changed
- staff/admin login
- C-Panel login
- access-token behavior
- session handling
- authentication routes
- staff role permissions

These require a dedicated authentication/data-flow threat model before any reconstruction.
