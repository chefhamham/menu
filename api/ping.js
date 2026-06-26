const TIMEOUT_MS = 10000;

function extractProjectRef(url) {
  if (!url) return null;
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/);
  return match ? match[1] : null;
}

module.exports = async function handler(req, res) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');

  if (req.method !== 'GET') {
    console.warn(`[api/ping] Rejected ${req.method} — method not allowed`);
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      ok: false,
      service: 'supabase',
      status: 'unreachable',
      httpStatus: 405,
      latency: 0,
      timestamp,
      error: `Method ${req.method} not allowed`
    });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('[api/ping] Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    return res.status(500).json({
      ok: false,
      service: 'supabase',
      status: 'unreachable',
      httpStatus: 500,
      latency: 0,
      timestamp,
      error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables'
    });
  }

  console.log('[api/ping] Starting — GET /auth/v1/health');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/health`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_ANON_KEY
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - start;

    if (response.ok) {
      const project = extractProjectRef(process.env.SUPABASE_URL);
      console.log(`[api/ping] Completed — ${response.status} in ${latency}ms`);
      return res.status(200).json({
        ok: true,
        service: 'supabase',
        status: 'reachable',
        httpStatus: response.status,
        latency,
        timestamp,
        ...(project ? { project } : {})
      });
    }

    console.warn(`[api/ping] Failed — HTTP ${response.status} in ${latency}ms`);
    return res.status(503).json({
      ok: false,
      service: 'supabase',
      status: 'unreachable',
      httpStatus: 503,
      latency,
      timestamp,
      error: `Supabase returned HTTP ${response.status}`
    });
  } catch (error) {
    clearTimeout(timeoutId);
    const latency = Date.now() - start;

    if (error.name === 'AbortError') {
      console.warn(`[api/ping] Timeout — ${TIMEOUT_MS}ms exceeded`);
      return res.status(503).json({
        ok: false,
        service: 'supabase',
        status: 'timeout',
        httpStatus: 503,
        latency: TIMEOUT_MS,
        timestamp,
        error: `Request timed out after ${TIMEOUT_MS}ms`
      });
    }

    console.error(`[api/ping] Error — ${error.message} in ${latency}ms`);
    return res.status(503).json({
      ok: false,
      service: 'supabase',
      status: 'unreachable',
      httpStatus: 503,
      latency,
      timestamp,
      error: error.message
    });
  }
};
