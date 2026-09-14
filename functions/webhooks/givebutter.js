const ALLOWED_EVENTS = new Set([
  'campaign.created',
  'transaction.succeeded',
  'contact.created',
  'plan.canceled',
  'plan.created',
  'plan.failed',
  'plan.paused',
  'plan.resumed',
  'plan.updated',
  'refund.created'
]);

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.GIVEBUTTER_WEBHOOK_SECRET) {
    return json({ ok: false, error: 'Webhook secret is not configured.' }, 503);
  }

  const signature = request.headers.get('Signature');
  if (!signature || signature !== env.GIVEBUTTER_WEBHOOK_SECRET) {
    return json({ ok: false, error: 'Invalid webhook signature.' }, 401);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON payload.' }, 400);
  }

  const event = payload?.event;
  if (!event || !ALLOWED_EVENTS.has(event)) {
    return json({ ok: false, error: 'Unsupported Givebutter event.' }, 400);
  }

  // Deliberately avoid logging the full payload because webhook data can
  // contain donor contact and transaction information.
  console.log(JSON.stringify({
    source: 'givebutter',
    event,
    event_id: payload?.id || null,
    received_at: new Date().toISOString()
  }));

  // Transport is intentionally separated from persistence. Before C-Panel
  // synchronization is enabled, add a Queue/D1 layer with idempotency so
  // retries cannot create duplicate donor or transaction records.

  return json({ ok: true });
}

export async function onRequestGet() {
  return json({
    ok: true,
    service: 'KMI Givebutter webhook receiver',
    method: 'POST required for webhook delivery'
  });
}
