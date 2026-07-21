/**
 * Deeray Pipeline Tracker — Cloudflare Worker
 *
 * Local scaffold only. Not deployed in Batch 1A.
 * No live GHL calls. No GHL token. No secret placeholder values.
 *
 * Routes:
 *   POST /ghl/proxy    — GHL REST API proxy (Phase 3)
 *   POST /ghl/webhook  — GHL webhook receiver (Phase 3)
 *   GET  /ghl/discover — GHL pipeline/stage discovery (Phase 3)
 *   GET  /health       — Health check (safe — does not reveal secret presence)
 *
 * Secret handling:
 *   - GHL_TOKEN is stored in .dev.vars locally and Cloudflare secrets in production
 *   - .dev.vars is in .gitignore and must never be committed
 *   - No secret placeholder value is committed to any file
 *   - Worker fails gracefully when secret is absent
 *   - /health endpoint does not reveal whether a specific secret exists
 *
 * Security:
 *   - No credential logging
 *   - Generic error messages only (no stack traces, no token echoing)
 *   - CORS restricted to the production origin
 */

interface Env {
  GHL_TOKEN?: string;
  // Add other secrets here as needed in Phase 3
}

const ALLOWED_ORIGIN = 'https://deeraymultimedia.github.io';

// ─── CORS ─────────────────────────────────────────────────────────────────────

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin === ALLOWED_ORIGIN || origin === 'http://localhost:5173';
  return {
    'Access-Control-Allow-Origin': allowed ? (origin ?? '') : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(
  body: unknown,
  status = 200,
  origin: string | null = null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

// ─── Route handlers ───────────────────────────────────────────────────────────

/**
 * GET /health
 * Returns operational status only. Does NOT reveal whether specific secret values exist.
 */
function handleHealth(_req: Request, origin: string | null): Response {
  return jsonResponse(
    {
      status: 'ok',
      service: 'deeray-pipeline-worker',
      version: '0.1.0',
      // Batch 1A: all GHL routes are stubs, not yet implemented
      routes: {
        '/ghl/proxy':    'not_implemented',
        '/ghl/webhook':  'not_implemented',
        '/ghl/discover': 'not_implemented',
      },
    },
    200,
    origin,
  );
}

/**
 * POST /ghl/proxy
 * Phase 3 stub — proxies authenticated requests to the GHL REST API.
 * Requires GHL_TOKEN secret (not configured in Batch 1A).
 */
function handleGhlProxy(_req: Request, env: Env, origin: string | null): Response {
  if (!env.GHL_TOKEN) {
    return jsonResponse(
      { error: 'Service not yet configured.', code: 'NOT_CONFIGURED' },
      503,
      origin,
    );
  }

  // Phase 3 implementation: forward request to GHL API with Authorization header
  return jsonResponse(
    { error: 'Not implemented.', code: 'NOT_IMPLEMENTED' },
    501,
    origin,
  );
}

/**
 * POST /ghl/webhook
 * Phase 3 stub — receives and validates GHL webhook events.
 */
function handleGhlWebhook(_req: Request, _env: Env, origin: string | null): Response {
  return jsonResponse(
    { error: 'Not implemented.', code: 'NOT_IMPLEMENTED' },
    501,
    origin,
  );
}

/**
 * GET /ghl/discover
 * Phase 3 stub — discovers GHL pipelines, stages, and sub-account configuration.
 * Requires GHL_TOKEN secret.
 */
function handleGhlDiscover(_req: Request, env: Env, origin: string | null): Response {
  if (!env.GHL_TOKEN) {
    return jsonResponse(
      { error: 'Service not yet configured.', code: 'NOT_CONFIGURED' },
      503,
      origin,
    );
  }

  return jsonResponse(
    { error: 'Not implemented.', code: 'NOT_IMPLEMENTED' },
    501,
    origin,
  );
}

// ─── Main fetch handler ───────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const path = url.pathname;
    const method = request.method;

    try {
      if (method === 'GET' && path === '/health') {
        return handleHealth(request, origin);
      }

      if (method === 'POST' && path === '/ghl/proxy') {
        return handleGhlProxy(request, env, origin);
      }

      if (method === 'POST' && path === '/ghl/webhook') {
        return handleGhlWebhook(request, env, origin);
      }

      if (method === 'GET' && path === '/ghl/discover') {
        return handleGhlDiscover(request, env, origin);
      }

      return jsonResponse(
        { error: 'Not found.', code: 'NOT_FOUND' },
        404,
        origin,
      );
    } catch (err) {
      // Generic error — never log token values, never expose stack traces
      console.error('[worker] Unhandled error:', err instanceof Error ? err.message : 'unknown');
      return jsonResponse(
        { error: 'An internal error occurred.', code: 'INTERNAL_ERROR' },
        500,
        origin,
      );
    }
  },
};

// Re-export for testing
export { handleHealth, handleGhlProxy, handleGhlWebhook, handleGhlDiscover };
export type { Env };
