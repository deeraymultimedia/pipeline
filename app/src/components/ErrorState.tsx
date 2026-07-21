import { useAuth } from '../contexts/AuthContext';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  const { auth, signIn } = useAuth();

  // Determine if this is an auth-recoverable error
  const isAuthError =
    auth.status === 'error' &&
    (auth.failure === 'session_expired' ||
      auth.failure === 'access_token_expired' ||
      auth.failure === 'access_revoked' ||
      auth.failure === 'reauthorisation_cancelled');

  const displayMessage =
    auth.status === 'error' ? auth.message : message;

  return (
    <div
      role="alert"
      className="error-state flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <span className="text-red-500 text-xl" aria-hidden="true">⚠</span>
      </div>
      <div>
        <h2 className="text-navy font-semibold">Something went wrong</h2>
        <p className="text-text-muted text-sm mt-1 max-w-xs">{displayMessage}</p>
      </div>
      <div className="flex gap-3">
        {isAuthError && (
          <button
            onClick={signIn}
            className="btn-primary px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors min-h-[44px]"
          >
            Reconnect Google
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-secondary px-4 py-2 border border-border-subtle text-navy rounded-lg text-sm font-medium hover:border-navy transition-colors min-h-[44px]"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
