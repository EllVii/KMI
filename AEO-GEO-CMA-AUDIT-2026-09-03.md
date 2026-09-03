# KMI SEO / AEO / GEO / UX / CI / PR / CMA Audit — 2026-09-03

## Audit scoring
These are internal production-readiness scores, not Google ranking scores or guarantees.

| Area | Score after this update | Assessment |
|---|---:|---|
| SEO | 95/100 | Strong technical and on-page foundation; custom domain, indexing verification, and independent authority remain the largest gaps. |
| AEO | 92/100 | Direct question-answer content, concise answers, strong intent routing, visible facts, and crawlable text now support answer-oriented retrieval. |
| GEO | 89/100 | Entity context, Las Vegas disambiguation, visible facts, structured data, and answer content improved; external corroboration and domain authority remain limiting factors. |
| Design / UI | 92/100 | Cohesive ministry identity, consistent cards, typography, media, and responsive patterns. |
| UX | 95/100 | One navigation model and clear paths for help, volunteering, partnerships, giving, education, and contact. |
| CX | 95/100 | Public promises now match actual behavior; demo data collection, developer setup text, and dead-end routes were removed from the visitor journey. |
| CI | 94/100 | KMI identity is more consistently tied to Las Vegas, its legal identity, ministry purpose, service areas, voice, and contact path. |
| PR | 80/100 | Stronger public fact base and partnership language; still needs dated impact stories, press-ready assets, and independent mentions. |
| CMA | 90/100 | KMI now presents a clearer value proposition and stronger conversion paths; competitors still have an advantage through established custom domains, public authority signals, and broader external footprint. |

## What changed and cause → effect

### New pages added after the August audit were not integrated into the SEO system
**Cause:** Give, cryptocurrency, contact, support, and ministry-area pages were added after the shared SEO configuration was created.

**Change:** Expanded page-aware metadata, canonical handling, indexing rules, structured data, mobile navigation, footer links, and support-assistant coverage.

**Effect:** New pages no longer inherit the homepage canonical/title behavior or introduce a second navigation model.

### Duplicate support and contact journeys
**Cause:** `get-support.html` and `contact.html` contained separate public forms and placeholder/demo behavior while `connect.html` was already the approved public routing hub.

**Change:** Converted both legacy URLs into `noindex` compatibility pages that route visitors to KMI Connect.

**Effect:** One customer journey remains authoritative, reducing duplicate intent, repeated data entry, trust friction, and SEO cannibalization.

### Broken ministry-area links
**Cause:** `ministry-areas.html` linked to six ministry detail pages that do not exist in the repository.

**Change:** Rebuilt the ministry hub to point only to live Resources, Outreach, Education, and Connect destinations.

**Effect:** Removes dead ends while preserving the useful ministry-area overview.

### Donation API failure on GitHub Pages
**Cause:** The browser attempted `/api/givebutter`, but the active GitHub Pages deployment cannot run that server endpoint.

**Change:** Removed the guaranteed API probe and retained provider activation through client configuration. Missing provider configuration now routes to a useful KMI contact path instead of displaying a technical failure.

**Effect:** Visitors no longer experience a false infrastructure error and future provider activation remains possible.

### Public donation page exposed developer setup language
**Cause:** The cryptocurrency page displayed account IDs, campaign-code instructions, configuration variable names, and setup checklists to donors.

**Change:** Reframed the page around donor trust, third-party processing, current availability, and a contact fallback. The page remains `noindex` until the organization-specific giving path is active.

**Effect:** Better CX and PR posture while preventing an incomplete payment page from competing in search.

### AEO / GEO content gap
**Cause:** Existing pages were descriptive but did not offer a single concise source for common questions about KMI.

**Change:** Added `faq.html` with direct, visible answers covering identity, location, resources, education, volunteering, partnerships, giving, and contact.

**Effect:** Gives people and retrieval systems clear answer-sized passages without creating hidden AI-only content or relying on unsupported special markup.

### Entity collision in search
**Cause:** Multiple unrelated organizations use the names Kingdom Missions International and KMI, and several operate on established custom domains.

**Change:** Strengthened visible and structured references to KMI’s Las Vegas base, legal name, service areas, ministry topics, and official contact email.

**Effect:** Better disambiguation for search engines, AI systems, partners, and media researchers.

## Compatibility safeguards
- All changes were built from the latest `main` after the September 2 donation commits.
- Existing public canonical URLs for Home, About, Resources, Education, Outreach, Connect, and Give were preserved.
- Legacy Contact and Get Support URLs remain reachable for bookmarks but are no longer separate indexable journeys.
- `crypto-donations.html` remains reachable from Give but is intentionally `noindex` until the donation link is live.
- Private/internal pages remain outside the public sitemap and public navigation.
- Existing mission images and video assets remain unchanged.
- Reduced-motion handling and accessible mobile navigation remain in the shared application layer.
- The KMI assistant still does not collect personal information.

## Competitive and growth opportunities

### Priority 0 — custom KMI domain
The largest SEO, GEO, CI, PR, and CMA opportunity is moving from the GitHub Pages project URL to a permanent KMI-owned domain. Update canonicals, sitemap, structured data, Search Console, backlink targets, and the Ell Vii’s case study together when the domain is selected.

### Priority 0 — Search Console and generative search measurement
Verify the live property in Google Search Console, submit the sitemap, inspect key URLs, and monitor classic and generative-search visibility. Search visibility should be measured from first-party data rather than third-party scoring alone.

### Priority 1 — independent authority
Earn legitimate mentions and links from real churches, ministry partners, food-distribution partners, educational organizations, event pages, community directories, and organizations that KMI actually works with. Independent corroboration is especially important because the KMI name is shared by unrelated ministries.

### Priority 1 — impact and news proof
Publish dated, factual impact updates: event recaps, food distributions, partnerships, educational milestones, mission trips, volunteer stories, and media coverage. Use real dates, locations, photos, responsible attribution, and measurable outcomes only when verified.

### Priority 1 — press / partner fact sheet
Create a lightweight press and partnership page containing KMI’s approved boilerplate, legal name, Las Vegas base, leadership names, service areas, official logo files, media contact, and links to verified impact stories. This strengthens PR, CI, AEO, and GEO simultaneously.

### Priority 1 — complete giving activation
Once the organization-specific Every.org and/or approved online donation links are active, update the Give and crypto pages, then decide whether the crypto page should become indexable. Never publish wallet keys or an incomplete provider setup as a donation CTA.

### Priority 2 — resource authority
If KMI wants to rank for local resource searches, build verified resource-guide content with provider names, eligibility notes, service areas, source links, and review dates. Do not create generic directory content without verification.

### Priority 2 — education trust details
When approved, publish current program availability, issuing/partner institutions, prerequisites, delivery format, costs, accreditation or recognition status where applicable, and contact instructions. Clear education details can materially improve trust and answer quality.

### Priority 2 — query-led FAQ expansion
Use actual Search Console queries and real incoming questions to expand the Questions & Answers page. Avoid mass-generated FAQ content; add only questions KMI can answer accurately and usefully.
