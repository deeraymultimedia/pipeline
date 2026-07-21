
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="loading-state flex flex-col items-center justify-center min-h-screen gap-4"
    >
      <div
        className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  );
}
