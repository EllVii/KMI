import { onRequestGet as givebutterApiGet } from '../functions/api/givebutter.js';
import {
  onRequestGet as givebutterWebhookGet,
  onRequestPost as givebutterWebhookPost
} from '../functions/webhooks/givebutter.js';

function notFound() {
  return Response.json(
    { ok: false, error: 'Not found.' },
    { status: 404, headers: { 'Cache-Control': 'no-store' } }
  );
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const context = { request, env, waitUntil: ctx.waitUntil.bind(ctx) };

    if (url.pathname === '/health') {
      return Response.json(
        {
          ok: true,
          service: 'KMI backend',
          givebutter: {
            api: Boolean(env.GIVEBUTTER_API_KEY),
            webhook_secret: Boolean(env.GIVEBUTTER_WEBHOOK_SECRET)
          }
        },
        { headers: { 'Cache-Control': 'no-store' } }
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

    if (url.pathname === '/') {
      return Response.json(
        {
          ok: true,
          service: 'KMI backend',
          routes: ['/health', '/api/givebutter', '/webhooks/givebutter']
        },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return notFound();
  }
};
