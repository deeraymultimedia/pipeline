import { useParams } from 'react-router-dom';
import { RoutePlaceholder } from '../components/RoutePlaceholder';

export function ClientDocumentsView() {
  const { clientId } = useParams<{ clientId: string }>();

  return (
    <RoutePlaceholder
      viewName="Client Documents"
      description={`Documents for client ${clientId ?? 'unknown'}. Document system available after Phase 2 (Drive integration) and client entity resolution.`}
    />
  );
}
