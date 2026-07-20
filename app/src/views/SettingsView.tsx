/**
 * SettingsView — Application settings (Batch 1B)
 *
 * Sections:
 *   - Data: link to Archived Opportunities
 *   - Application: company info, version, environment
 *   - Integrations: Google Sheets, Drive, Automation — all Pending Phase 2/3
 */

import { Link } from 'react-router-dom';
import { COMPANY } from '../constants/company';
import { PageContainer } from '../components/PageContainer';

const APP_VERSION = 'Batch 1B — Prototype';
const ENVIRONMENT = 'Demo data';

interface SettingRowProps {
  label: string;
  value: string;
  muted?: boolean;
}

function SettingRow({ label, value, muted = false }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border-subtle last:border-0">
      <dt className="text-sm font-medium text-navy shrink-0">{label}</dt>
      <dd className={`text-sm text-right ${muted ? 'text-text-muted' : 'text-navy'}`}>{value}</dd>
    </div>
  );
}

export function SettingsView() {
  return (
    <PageContainer title="Settings">
      <div className="max-w-2xl flex flex-col gap-6">
        {/* Data */}
        <section aria-labelledby="data-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <h2 id="data-heading" className="font-semibold text-navy mb-4">Data</h2>
          <Link
            to="/settings/archived"
            className="inline-flex items-center gap-2 text-sm text-teal font-medium hover:underline"
          >
            Archived Opportunities →
          </Link>
        </section>

        {/* Application */}
        <section aria-labelledby="app-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <h2 id="app-heading" className="font-semibold text-navy mb-2">Application</h2>
          <dl>
            <SettingRow label="Company"     value={COMPANY.name} />
            <SettingRow label="Reg. number" value={COMPANY.number} />
            <SettingRow label="Website"     value={COMPANY.website} />
            <SettingRow label="Version"     value={APP_VERSION} muted />
            <SettingRow label="Environment" value={ENVIRONMENT} muted />
          </dl>
        </section>

        {/* Integrations */}
        <section aria-labelledby="integrations-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <h2 id="integrations-heading" className="font-semibold text-navy mb-2">Integrations</h2>
          <dl>
            <SettingRow label="Google Sheets"  value="Pending (Phase 2)" muted />
            <SettingRow label="Google Drive"   value="Pending (Phase 3)" muted />
            <SettingRow label="Automation"     value="Pending (Phase 3)" muted />
          </dl>
          <div className="mt-4 flex items-start gap-2 p-3 bg-teal-light border border-teal/20 rounded-lg text-sm text-navy">
            <span aria-hidden="true">ℹ</span>
            <p>No credentials are stored in this prototype. All data shown is demo data held in memory only.</p>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
