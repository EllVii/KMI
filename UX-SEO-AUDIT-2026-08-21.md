# KMI UX / UI / CX / SEO Audit — 2026-08-21

## Goal
Synchronize KMI's search experience, visual hierarchy, navigation, calls to action, and customer journey so visitors can understand what KMI offers and choose the correct next step without confusion.

## Findings and corrections

### Mobile navigation
**Cause:** The responsive layout stacked navigation links vertically on small screens, consuming space and making the first screen feel crowded.

**Change:** Added an accessible Menu control with `aria-expanded`, Escape-to-close behavior, close-on-navigation behavior, and a visible-link fallback when JavaScript is unavailable.

**Effect:** Mobile visitors get a compact header while retaining full navigation access and keyboard accessibility.

### Homepage decision load
**Cause:** The previous hero presented several actions without clearly separating people who need help from people who want to volunteer, partner, or ask about education.

**Change:** Made **Get Help or Connect** the primary action and added four clear pathways: Get Help, Volunteer, Partner, and Education.

**Effect:** Visitors can self-select their intent immediately instead of reading multiple sections before knowing where to go.

### Cross-page consistency
**Cause:** About, Resources, Education, and Outreach used different next-step patterns.

**Change:** Standardized public navigation and contextual calls to action so each page routes to the matching Connect section.

**Effect:** The same mental model works across the website, reducing dead ends and backtracking.

### Support assistant trust
**Cause:** The prior assistant asked for personal details even though the submission only saved locally as a demo CRM entry.

**Change:** Removed personal-data collection from the public assistant. It now provides navigation and topic guidance, then routes visitors to the appropriate KMI page or email contact.

**Effect:** Removes a trust-breaking mismatch between what the interface appeared to do and what it actually did while preserving useful assistance.

### Accessibility and UI polish
**Change:** Added a skip link, stronger focus-visible states, 44px minimum CTA height, improved mobile typography, responsive action grids, reduced-motion handling, and a stable footer-logo size.

**Effect:** Improves keyboard use, touch usability, visual consistency, and layout stability.

### SEO alignment
**Change:** Preserved canonical URLs, index controls, structured data, descriptive internal links, page-specific titles/descriptions, and refreshed sitemap modification dates to 2026-08-21.

**Effect:** Search intent and on-page customer intent now point to the same public page structure.

## Compatibility safeguards
- Branch started from current `main` and remained 0 commits behind during final comparison.
- Existing public page URLs were preserved.
- Existing mission photography and video assets were preserved.
- Existing private/internal pages were not added to public navigation.
- Existing `noindex` behavior for unfinished/private pages remains in the shared SEO configuration.
- The assistant includes a global duplicate-load guard.
- Mobile navigation falls back to visible links when the JavaScript Menu control is unavailable.
- Reduced-motion preferences remain respected.

## Remaining external dependency
A permanent KMI custom domain would further strengthen branding and SEO. Until that is connected, canonical URLs remain on the GitHub Pages KMI address.
