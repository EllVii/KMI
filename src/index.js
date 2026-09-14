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

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  return {
    'Access-Control-Allow-Origin': PUBLIC_ORIGINS.has(origin) ? origin : 'https://ellvii.github.io',
    'Vary': 'Origin',
    'Cache-Control': 'no-store'
  };
}

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers }
  });
}

function methodNotAllowed(allowed) {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: {
      Allow: allowed.join(', '),
      'Cache-Control': 'no-store'
    }
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const context = { request, env, waitUntil: ctx.waitUntil.bind(ctx) };

    if (url.pathname === '/health') {
      return json({
        ok: true,
        service: 'KMI backend',
        givebutter: {
          api: Boolean(env.GIVEBUTTER_API_KEY),
          webhook_secret: Boolean(env.GIVEBUTTER_WEBHOOK_SECRET),
          donation_button: Boolean(env.KMI_MAIN_DONATION_BUTTON),
          donation_form: Boolean(env.KMI_MAIN_DONATION_FORM),
          widget_library: hasWidgetLoader(env)
        }
      });
    }

    if (url.pathname === '/api/public-config') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            ...corsHeaders(request),
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
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

    if (url.pathname === '/api/givebutter') {
      if (request.method !== 'GET') return methodNotAllowed(['GET']);
      return givebutterApiGet(context);
    }

    if (url.pathname === '/webhooks/givebutter') {
      if (request.method === 'GET') return givebutterWebhookGet(context);
      if (request.method === 'POST') return givebutterWebhookPost(context);
      return methodNotAllowed(['GET', 'POST']);
    }

    if (env.ASSETS) return env.ASSETS.fetch(request);

    return json({ ok: false, error: 'Not found.' }, 404);
  }
};
