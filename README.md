# Kingdom Mission International Prototype

Static prototype for Kingdom Mission International.

## Included

- Home
- About
- Resources
- Edu / Loving to Learn
- Outreach
- Timeline
- Plans / Monthly CRM support

## Prototype notes

This is a working prototype only. Donation/payment processing should use a trusted third-party provider such as Zeffy, Square, PayPal, or Stripe. No card data should be stored on this website.

Final 508(c)(1)(A), religious trust, nonprofit, tax, and counseling language should be reviewed by qualified legal/tax professionals before launch.

Built by Ell Vii's Automations.
Website: https://ellviisautomations.com
## Website to KMI-crm inquiries

The public `connect.html` now has an optional, progressive-enhancement online inquiry form. Its existing email links continue to work. **The form stays hidden** until all four website Worker environment values below are configured and Turnstile can load:

- `TURNSTILE_SITE_KEY` (public website Worker variable, restricted to `kingdommissionsglobal.org` and `www.kingdommissionsglobal.org` in Cloudflare Turnstile).
- `TURNSTILE_SECRET_KEY` (Worker secret, never in Git).
- `KMI_CRM_URL` (the HTTPS origin of the deployed `kmi-crm` Worker).
- `KMI_CRM_INGEST_TOKEN` (Worker secret, same value as the CRM Worker's secret `KMI_WEBSITE_SYNC_TOKEN`).

The public browser posts only to this website's `/api/crm/inquiry`. The server checks Turnstile's siteverify endpoint including the validated hostname and forwards the validated request with the private shared token to `/api/integrations/website` on the CRM. Do **not** put the shared secret in JS, HTML or `wrangler.jsonc`. For same-account Worker-to-Worker communication, configure a Cloudflare service binding named `CRM_SERVICE` when the target CRM Worker exists; the bridge supports it and otherwise uses HTTPS Worker origin fetch. Test the service binding/route before revealing the form. Do not enable until the CRM D1 schema and staff login are configured.

These submissions become source-tagged CRM Incoming Records and are not public. Emails sent through existing `mailto:` links are **not** automatically captured; separate inbound-email ingestion is needed for that. The website and KMI-app do not share or replace each other's production D1 database.
