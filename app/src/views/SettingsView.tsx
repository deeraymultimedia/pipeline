import { Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';

export function SettingsView() {
  return (
    <PageContainer title="Settings">
      <nav aria-label="Settings sections">
        <ul className="list-none p-0 space-y-2">
          <li>
            <Link
              to="/settings/archived"
              className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-border-subtle hover:border-navy transition-colors text-navy text-sm font-medium min-h-[48px]"
            >
              <span>Archived Opportunities</span>
              <span aria-hidden="true">›</span>
            </Link>
          </li>
        </ul>
      </nav>
    </PageContainer>
  );
}
