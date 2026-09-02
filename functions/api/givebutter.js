const ALLOWED_RESOURCES = new Set(['campaigns', 'funds']);

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!env.GIVEBUTTER_API_KEY) {
    return Response.json(
      { ok: false, error: 'GIVEBUTTER_API_KEY is not configured.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const url = new URL(request.url);
  const resource = url.searchParams.get('resource') || 'campaigns';

  if (!ALLOWED_RESOURCES.has(resource)) {
    return Response.json(
      { ok: false, error: 'Unsupported Givebutter resource.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const upstream = new URL(`https://api.givebutter.com/v1/${resource}`);
  const page = url.searchParams.get('page');
  if (page) upstream.searchParams.set('page', page);

  const response = await fetch(upstream.toString(), {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${env.GIVEBUTTER_API_KEY}`
    }
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
