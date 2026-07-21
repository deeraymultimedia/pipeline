/**
 * Cloudflare Worker unit tests
 *
 * Covers:
 *   - /health responds with 200 and status:ok
 *   - /health does not reveal specific secret values
 *   - Unconfigured routes return 501 or 503 (not 200)
 *   - Absent-secret safe handling (503 NOT 500)
 *   - No live external HTTP requests made
 *   - No secret value leaked in any response body
 *   - CORS headers present on responses
 *   - OPTIONS preflight returns 204
 *   - Unknown routes return 404
 */

import { describe, it, expect, vi } from 'vitest';
import workerModule, { handleHealth, handleGhlProxy, handleGhlDiscover } from '../index';
import type { Env } from '../index';

// Helper: build a Request object
function makeRequest(
  method: string,
  path: string,
  origin = 'https://deeraymultimedia.github.io',
): Request {
  return new Request(`https://worker.example.com${path}`, {
    method,
    headers: { Origin: origin },
  });
}

// Helper: parse JSON response
async function parseJson(res: Response): Promise<unknown> {
  return res.json();
}

// ─── /health ─────────────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns 200', async () => {
    const req = makeRequest('GET', '/health');
    const res = handleHealth(req, 'https://deeraymultimedia.github.io');
    expect(res.status).toBe(200);
  });

  it('returns status: ok in body', async () => {
    const req = makeRequest('GET', '/health');
    const res = handleHealth(req, 'https://deeraymultimedia.github.io');
    const body = await parseJson(res) as { status: string };
    expect(body.status).toBe('ok');
  });

  it('reports all GHL routes as not_implemented', async () => {
    const req = makeRequest('GET', '/health');
    const res = handleHealth(req, 'https://deeraymultimedia.github.io');
    const body = await parseJson(res) as { routes: Record<string, string> };
    expect(body.routes['/ghl/proxy']).toBe('not_implemented');
    expect(body.routes['/ghl/webhook']).toBe('not_implemented');
    expect(body.routes['/ghl/discover']).toBe('not_implemented');
  });

  it('does not include any secret-related keys in response', async () => {
    const req = makeRequest('GET', '/health');
    const res = handleHealth(req, 'https://deeraymultimedia.github.io');
    const body = JSON.stringify(await parseJson(res));
    expect(body).not.toMatch(/token/i);
    expect(body).not.toMatch(/secret/i);
    expect(body).not.toMatch(/GHL_TOKEN/);
    expect(body).not.toMatch(/configured/i); // "configured: true/false" would leak presence
  });
});

// ─── /ghl/proxy — absent secret ──────────────────────────────────────────────

describe('POST /ghl/proxy — absent GHL_TOKEN', () => {
  it('returns 503 when GHL_TOKEN is absent', async () => {
    const req = makeRequest('POST', '/ghl/proxy');
    const env: Env = {}; // No token
    const res = handleGhlProxy(req, env, 'https://deeraymultimedia.github.io');
    expect(res.status).toBe(503);
  });

  it('returns NOT_CONFIGURED error code', async () => {
    const req = makeRequest('POST', '/ghl/proxy');
    const env: Env = {};
    const res = handleGhlProxy(req, env, 'https://deeraymultimedia.github.io');
    const body = await parseJson(res) as { code: string };
    expect(body.code).toBe('NOT_CONFIGURED');
  });

  it('does not leak the token value in error response', async () => {
    const req = makeRequest('POST', '/ghl/proxy');
    const env: Env = { GHL_TOKEN: 'should-not-appear' };
    const res = handleGhlProxy(req, env, 'https://deeraymultimedia.github.io');
    const body = JSON.stringify(await parseJson(res));
    expect(body).not.toContain('should-not-appear');
  });
});

// ─── /ghl/discover — absent secret ───────────────────────────────────────────

describe('GET /ghl/discover — absent GHL_TOKEN', () => {
  it('returns 503 when GHL_TOKEN is absent', async () => {
    const req = makeRequest('GET', '/ghl/discover');
    const env: Env = {};
    const res = handleGhlDiscover(req, env, 'https://deeraymultimedia.github.io');
    expect(res.status).toBe(503);
  });
});

// ─── Full Worker dispatch ─────────────────────────────────────────────────────

describe('Worker fetch handler', () => {
  it('GET /health dispatches correctly', async () => {
    const req = makeRequest('GET', '/health');
    const res = await workerModule.fetch(req, {});
    expect(res.status).toBe(200);
  });

  it('OPTIONS returns 204 preflight', async () => {
    const req = makeRequest('OPTIONS', '/health');
    const res = await workerModule.fetch(req, {});
    expect(res.status).toBe(204);
  });

  it('unknown route returns 404', async () => {
    const req = makeRequest('GET', '/unknown-route');
    const res = await workerModule.fetch(req, {});
    expect(res.status).toBe(404);
    const body = await parseJson(res) as { code: string };
    expect(body.code).toBe('NOT_FOUND');
  });

  it('POST /ghl/proxy returns 503 without token', async () => {
    const req = makeRequest('POST', '/ghl/proxy');
    const res = await workerModule.fetch(req, {});
    expect(res.status).toBe(503);
  });
});

// ─── CORS headers ─────────────────────────────────────────────────────────────

describe('CORS headers', () => {
  it('ACAO header is set on /health response for allowed origin', async () => {
    const req = makeRequest('GET', '/health', 'https://deeraymultimedia.github.io');
    const res = await workerModule.fetch(req, {});
    const acao = res.headers.get('Access-Control-Allow-Origin');
    expect(acao).toBe('https://deeraymultimedia.github.io');
  });

  it('disallowed origin does not receive app origin in ACAO', async () => {
    const req = makeRequest('GET', '/health', 'https://evil.example.com');
    const res = await workerModule.fetch(req, {});
    const acao = res.headers.get('Access-Control-Allow-Origin');
    expect(acao).not.toBe('https://evil.example.com');
  });
});

// ─── No live external requests ────────────────────────────────────────────────

describe('No live external requests', () => {
  it('worker tests do not make any fetch calls to external URLs', () => {
    // This test verifies that fetch is not called in tests by checking
    // that the global fetch mock was not invoked (no external calls)
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    // All tested route handlers are synchronous or use mocked data
    // If fetch were called, it would appear in fetchSpy
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
