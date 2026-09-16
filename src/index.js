import { onRequestGet as givebutterApiGet } from '../functions/api/givebutter.js';
import {
  onRequestGet as givebutterWebhookGet,
  onRequestPost as givebutterWebhookPost
} from '../functions/webhooks/givebutter.js';

const PUBLIC_ORIGINS = new Set([
  'https://ellvii.github.io',
  'https://kingdommissionsglobal.org',
  'https://www.kingdommissionsglobal.org'
]);

const PRIVATE_COMPATIBILITY_PATHS = new Set([
  '/crm.html',
  '/plans.html',
  '/timeline.html',
  '/brochure.html'
]);

const BASE_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const headers = {
    Vary: 'Origin',
    'Cache-Control': 'no-store'
  };

  if (origin && PUBLIC_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

function withSecurityHeaders(headers = {}) {
  return { ...BASE_SECURITY_HEADERS, ...headers };
}

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: withSecurityHeaders({ 'Cache-Control': 'no-store', ...headers })
  });
}

function methodNotAllowed(allowed) {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: withSecurityHeaders({
      Allow: allowed.join(', '),
      'Cache-Control': 'no-store'
    })
  });
}

function hasWidgetLoader(env) {
  const combined = [
    env.GIVEBUTTER_WIDGET_LIBRARY,
    env.KMI_MAIN_DONATION_BUTTON,
    env.KMI_MAIN_DONATION_FORM
  ].filter(Boolean).join(' ');
  return /widgets\.givebutter\.com/i.test(combined);
}

function publicGivingReady(env) {
  return Boolean(
    env.KMI_MAIN_DONATION_BUTTON
    && env.KMI_MAIN_DONATION_FORM
    && hasWidgetLoader(env)
  );
}

async function secureAssetResponse(response, pathname) {
  const headers = new Headers(response.headers);
  Object.entries(BASE_SECURITY_HEADERS).forEach(([name, value]) => headers.set(name, value));

  if (PRIVATE_COMPATIBILITY_PATHS.has(pathname)) {
    headers.set('Cache-Control', 'no-store, private');
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const context = { request, env, waitUntil: ctx.waitUntil.bind(ctx) };

    if (url.pathname === '/health') {
      return json({
        ok: true,
        service: 'KMI backend',
        public_giving: publicGivingReady(env) ? 'ready' : 'configuration-required'
      });
    }

    if (url.pathname === '/api/public-config') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: withSecurityHeaders({
            ...corsHeaders(request),
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          })
        });
      }
      if (request.method !== 'GET') return methodNotAllowed(['GET', 'OPTIONS']);

      return json(
        {
          givebutter: {
            widgetLibrary: env.GIVEBUTTER_WIDGET_LIBRARY || '',
            donationButton: env.KMI_MAIN_DONATION_BUTTON || '',
            donationForm: env.KMI_MAIN_DONATION_FORM || ''
          }
        },
        200,
        corsHeaders(request)
      );
    }

    // Public proxy remains deliberately limited to non-sensitive fundraising metadata.
    // Donor, transaction, payout, recurring-plan, and webhook data must never use this route.
    if (url.pathname === '/api/givebutter') {
      if (request.method !== 'GET') return methodNotAllowed(['GET']);
      return givebutterApiGet(context);
    }

    if (url.pathname === '/webhooks/givebutter') {
      if (request.method === 'GET') return givebutterWebhookGet(context);
      if (request.method === 'POST') return givebutterWebhookPost(context);
      return methodNotAllowed(['GET', 'POST']);
    }

    if (env.ASSETS) {
      return secureAssetResponse(await env.ASSETS.fetch(request), url.pathname);
    }

    return json({ ok: false, error: 'Not found.' }, 404);
  }
};
