import { useParams } from 'react-router-dom';
import { RoutePlaceholder } from '../components/RoutePlaceholder';

export function ClientDetailView() {
  const { clientId } = useParams<{ clientId: string }>();

  return (
    <RoutePlaceholder
      viewName="Client Detail"
      description={`Client ID: ${clientId ?? 'unknown'}. Detail view available after client entity strategy is resolved.`}
    />
  );
}
