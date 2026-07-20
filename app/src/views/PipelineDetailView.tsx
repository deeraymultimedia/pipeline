import { useParams } from 'react-router-dom';
import { RoutePlaceholder } from '../components/RoutePlaceholder';

export function PipelineDetailView() {
  const { id } = useParams<{ id: string }>();

  return (
    <RoutePlaceholder
      viewName="Opportunity Detail"
      description={`Opportunity ID: ${id ?? 'unknown'}. Detail view coming in the next batch.`}
    />
  );
}
