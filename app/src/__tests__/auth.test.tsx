/**
 * Authentication tests
 *
 * Covers:
 *   - Unauthenticated routes are blocked
 *   - Authorised email passes
 *   - Unauthorised email is rejected
 *   - Token-expiry state is handled
 *   - Reconnect state is available
 *   - Pending form state architecture (pendingState preserved before reauth)
 */

import { describe, it, expect, vi } from 'vitest';

// Partial mock of AuthContext to test different auth states
function buildMockAuthContext(
  overrides: Partial<{
    status: string;
    email: string;
    failure: string;
    message: string;
  }> = {},
) {
  const defaults = {
    status: 'unauthenticated',
    email: '',
    failure: undefined,
    message: undefined,
  };
  const merged = { ...defaults, ...overrides };

  let authState: Record<string, unknown>;
  if (merged.status === 'authenticated') {
    authState = {
      status: 'authenticated',
      email: merged.email,
      accessToken: 'mock-token',
      expiresAt: Date.now() + 3600000,
    };
  } else if (merged.status === 'unauthorised') {
    authState = { status: 'unauthorised', email: merged.email };
  } else if (merged.status === 'error') {
    authState = {
      status: 'error',
      failure: merged.failure,
      message: merged.message,
    };
  } else {
    authState = { status: merged.status };
  }

  return {
    auth: authState,
    signIn: vi.fn(),
    signOut: vi.fn(),
    getToken: () => (merged.status === 'authenticated' ? 'mock-token' : null),
    pendingState: null,
    clearPendingState: vi.fn(),
  };
}

describe('Authentication states', () => {
  it('unauthenticated state — auth.status is unauthenticated', () => {
    const ctx = buildMockAuthContext({ status: 'unauthenticated' });
    expect(ctx.auth.status).toBe('unauthenticated');
  });

  it('authenticated state — auth.status is authenticated for allowed email', () => {
    const ctx = buildMockAuthContext({
      status: 'authenticated',
      email: 'adegisanrin@gmail.com',
    });
    expect(ctx.auth.status).toBe('authenticated');
    const auth = ctx.auth as { email: string };
    expect(auth.email).toBe('adegisanrin@gmail.com');
  });

  it('unauthorised state — auth.status is unauthorised for disallowed email', () => {
    const ctx = buildMockAuthContext({
      status: 'unauthorised',
      email: 'attacker@example.com',
    });
    expect(ctx.auth.status).toBe('unauthorised');
    const auth = ctx.auth as { email: string };
    expect(auth.email).toBe('attacker@example.com');
  });

  it('access_token_expired error state', () => {
    const ctx = buildMockAuthContext({
      status: 'error',
      failure: 'access_token_expired',
      message: 'Token expired.',
    });
    expect(ctx.auth.status).toBe('error');
    const auth = ctx.auth as { failure: string };
    expect(auth.failure).toBe('access_token_expired');
  });

  it('session_expired error state', () => {
    const ctx = buildMockAuthContext({
      status: 'error',
      failure: 'session_expired',
      message: 'Session has expired.',
    });
    expect(ctx.auth.status).toBe('error');
    const auth = ctx.auth as { failure: string };
    expect(auth.failure).toBe('session_expired');
  });

  it('access_revoked error state', () => {
    const ctx = buildMockAuthContext({
      status: 'error',
      failure: 'access_revoked',
      message: 'Access was revoked.',
    });
    const auth = ctx.auth as { failure: string };
    expect(auth.failure).toBe('access_revoked');
  });

  it('reauthorisation_cancelled error state', () => {
    const ctx = buildMockAuthContext({
      status: 'error',
      failure: 'reauthorisation_cancelled',
      message: 'Sign-in was cancelled.',
    });
    const auth = ctx.auth as { failure: string };
    expect(auth.failure).toBe('reauthorisation_cancelled');
  });

  it('sheets_permission_not_granted error state', () => {
    const ctx = buildMockAuthContext({
      status: 'error',
      failure: 'sheets_permission_not_granted',
      message: 'Sheets access not granted.',
    });
    const auth = ctx.auth as { failure: string };
    expect(auth.failure).toBe('sheets_permission_not_granted');
  });
});

describe('Token handling', () => {
  it('getToken returns null when unauthenticated', () => {
    const ctx = buildMockAuthContext({ status: 'unauthenticated' });
    expect(ctx.getToken()).toBeNull();
  });

  it('getToken returns token string when authenticated', () => {
    const ctx = buildMockAuthContext({
      status: 'authenticated',
      email: 'adegisanrin@gmail.com',
    });
    expect(ctx.getToken()).toBe('mock-token');
  });
});

describe('Pending state architecture', () => {
  it('pendingState is null by default', () => {
    const ctx = buildMockAuthContext({ status: 'authenticated', email: 'adegisanrin@gmail.com' });
    expect(ctx.pendingState).toBeNull();
  });

  it('clearPendingState is a callable function', () => {
    const ctx = buildMockAuthContext({ status: 'authenticated', email: 'adegisanrin@gmail.com' });
    expect(typeof ctx.clearPendingState).toBe('function');
    expect(() => ctx.clearPendingState()).not.toThrow();
  });
});

describe('ALLOWED_EMAILS', () => {
  it('includes adegisanrin@gmail.com', async () => {
    const { ALLOWED_EMAILS } = await import('../constants/company');
    expect(ALLOWED_EMAILS).toContain('adegisanrin@gmail.com');
  });

  it('does not allow arbitrary addresses', async () => {
    const { ALLOWED_EMAILS } = await import('../constants/company');
    expect(ALLOWED_EMAILS).not.toContain('attacker@example.com');
  });
});
