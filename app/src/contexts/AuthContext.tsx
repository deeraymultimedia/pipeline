/* eslint-disable react-refresh/only-export-components */
/**
 * AuthContext
 *
 * Google Identity Services authentication for the Deeray Pipeline Tracker.
 * Preserves the single-authorised-account model from the current live application.
 *
 * OAuth notes:
 *   - Uses GIS token client (implicit/token flow) — no refresh token issued
 *   - Access token held in memory only (never in localStorage or sessionStorage)
 *   - External app in Testing status: access token ~1 hour; reauth on expiry
 *   - Google session continuity may speed reauth but is not guaranteed silent renewal
 *   - Batch 1A: no Drive scope, no OAuth config changes
 *
 * Failure states handled:
 *   - session_expired
 *   - access_token_expired
 *   - access_revoked
 *   - sheets_permission_not_granted
 *   - drive_permission_not_granted  (future)
 *   - picker_unavailable            (future)
 *   - reauthorisation_cancelled
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { GOOGLE_CLIENT_ID, ALLOWED_EMAILS } from '../constants/company';
import type { AuthFailureState } from '../types/enums';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthState =
  | { status: 'unauthenticated' }
  | { status: 'loading' }
  | { status: 'authenticated'; email: string; accessToken: string; expiresAt: number }
  | { status: 'unauthorised'; email: string }
  | { status: 'error'; failure: AuthFailureState; message: string };

export interface AuthContextValue {
  auth: AuthState;
  signIn: () => void;
  signOut: () => void;
  /** Returns current token or triggers reauth if expired. Preserves pendingState before reauth. */
  getToken: (pendingState?: unknown) => string | null;
  /** Last preserved pending state (form input, navigation target, etc.) */
  pendingState: unknown;
  clearPendingState: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Google Identity Services type shim ──────────────────────────────────────
// GIS is loaded via <script> tag in index.html; declare its shape here.

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: GisTokenClientConfig) => GisTokenClient;
          revoke: (token: string, callback: () => void) => void;
        };
        id: {
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GisTokenClientConfig {
  client_id: string;
  scope: string;
  prompt?: string;
  callback: (response: GisTokenResponse) => void;
  error_callback?: (error: GisTokenError) => void;
}

interface GisTokenClient {
  requestAccessToken: (overrides?: { prompt?: string }) => void;
}

interface GisTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
}

interface GisTokenError {
  type: string;
  message?: string;
}

// ─── Scopes ───────────────────────────────────────────────────────────────────

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
// drive.file scope is NOT requested in Batch 1A.
// Add here when Phase 2 document system is authorised.

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: 'unauthenticated' });
  const [pendingState, setPendingState] = useState<unknown>(null);
  const tokenClientRef = useRef<GisTokenClient | null>(null);

  const validateToken = useCallback(
    async (token: string, expiresIn: number) => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
        );
        if (!res.ok) {
          setAuth({
            status: 'error',
            failure: 'access_token_expired',
            message: 'Could not verify access token. Please sign in again.',
          });
          return;
        }

        const info = (await res.json()) as { email?: string; error?: string };

        if (info.error || !info.email) {
          setAuth({
            status: 'error',
            failure: 'access_revoked',
            message: 'Access has been revoked. Please sign in again.',
          });
          return;
        }

        if (!ALLOWED_EMAILS.includes(info.email)) {
          setAuth({ status: 'unauthorised', email: info.email });
          return;
        }

        const expiresAt = Date.now() + expiresIn * 1000;
        setAuth({
          status: 'authenticated',
          email: info.email,
          accessToken: token,
          expiresAt,
        });
      } catch {
        setAuth({
          status: 'error',
          failure: 'session_expired',
          message: 'Unable to verify sign-in. Check your connection and try again.',
        });
      }
    },
    [],
  );


  const handleTokenResponse = useCallback((response: GisTokenResponse) => {
    if (response.error) {
      if (response.error === 'access_denied') {
        setAuth({
          status: 'error',
          failure: 'reauthorisation_cancelled',
          message: 'Authorisation was cancelled. Please sign in again to continue.',
        });
        return;
      }

      // Scope check — determine which scope is missing
      const scopesGranted = response.scope?.split(' ') ?? [];
      if (!scopesGranted.includes(SHEETS_SCOPE)) {
        setAuth({
          status: 'error',
          failure: 'sheets_permission_not_granted',
          message: 'Google Sheets access was not granted. Please authorise Sheets access to continue.',
        });
        return;
      }

      setAuth({
        status: 'error',
        failure: 'session_expired',
        message: `Google authorisation error: ${response.error}`,
      });
      return;
    }

    // Access token received — validate the authorised account via the token info endpoint
    validateToken(response.access_token, response.expires_in);
  }, [validateToken]);

  const handleTokenError = useCallback((error: GisTokenError) => {
    if (error.type === 'popup_closed') {
      setAuth({
        status: 'error',
        failure: 'reauthorisation_cancelled',
        message: 'Sign-in was cancelled.',
      });
      return;
    }
    setAuth({
      status: 'error',
      failure: 'session_expired',
      message: error.message ?? 'An unknown sign-in error occurred.',
    });
  }, []);

  // Initialise GIS token client when the GIS script is available
  useEffect(() => {
    const init = () => {
      if (!window.google?.accounts?.oauth2) return;
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SHEETS_SCOPE,
        callback: handleTokenResponse,
        error_callback: handleTokenError,
      });
    };

    if (window.google) {
      init();
    } else {
      // GIS script may still be loading — retry once it fires
      const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      script?.addEventListener('load', init, { once: true });
    }
  }, [handleTokenResponse, handleTokenError]);

  const signIn = useCallback(() => {
    setAuth({ status: 'loading' });
    tokenClientRef.current?.requestAccessToken({ prompt: '' });
  }, []);

  const signOut = useCallback(() => {
    if (auth.status === 'authenticated') {
      window.google?.accounts?.oauth2.revoke(auth.accessToken, () => {});
      window.google?.accounts?.id.disableAutoSelect();
    }
    setPendingState(null);
    setAuth({ status: 'unauthenticated' });
  }, [auth]);

  const getToken = useCallback(
    (pending?: unknown): string | null => {
      if (auth.status !== 'authenticated') {
        if (pending !== undefined) setPendingState(pending);
        signIn();
        return null;
      }

      // Check if access token is within 5 minutes of expiry
      if (Date.now() > auth.expiresAt - 5 * 60 * 1000) {
        if (pending !== undefined) setPendingState(pending);
        signIn();
        return null;
      }

      return auth.accessToken;
    },
    [auth, signIn],
  );

  const clearPendingState = useCallback(() => setPendingState(null), []);

  return (
    <AuthContext.Provider
      value={{ auth, signIn, signOut, getToken, pendingState, clearPendingState }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
