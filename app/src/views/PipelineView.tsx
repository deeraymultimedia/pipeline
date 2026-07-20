/**
 * PipelineView
 *
 * URL-persisted stage filter: ?stage={stageId}
 * Desktop: multi-column Kanban
 * Mobile: single-stage view with stage selector
 */
import { useSearchParams } from 'react-router-dom';
import { RoutePlaceholder } from '../components/RoutePlaceholder';

export function PipelineView() {
  const [searchParams] = useSearchParams();
  const selectedStage = searchParams.get('stage');

  return (
    <RoutePlaceholder
      viewName="Pipeline"
      description={
        selectedStage
          ? `Showing stage: ${selectedStage}. Full pipeline Kanban view coming in the next batch.`
          : 'Full pipeline Kanban view coming in the next batch.'
      }
    />
  );
}
