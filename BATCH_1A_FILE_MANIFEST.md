# Batch 1A — File Manifest

**Deeray Multimedia Ltd — Pipeline Tracker Premium Rebuild**
Date: 20 July 2026

---

## Counts

| Category | Count |
|----------|-------|
| Application source (app/src) — non-test | 40 |
| Application test files (app/src/__tests__) | 6 |
| Application configuration (app root) | 10 |
| Worker source (worker/src) — non-test | 1 |
| Worker test files (worker/src/__tests__) | 1 |
| Worker configuration (worker root) | 5 |
| Root documentation | 4 |
| **Total files** | **67** |

**Clarification:** The figure of 66 in the initial Batch 1A completion report predates the creation of `BATCH_1A_COMPLETION_REPORT.md`. The current workspace contains 67 files. This manifest lists files only — no directories are counted.

The archive `deeray-pipeline-batch-1a.zip` includes 68 files: all 67 listed here plus `.gitignore` (included because it governs secret file exclusion and is required for repository setup).

---

## Root Files

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `.gitignore` | Excludes `node_modules/`, `dist/`, `worker/.dev.vars`, `.env*` from git | Config | 46 | Configuration | None | No |
| `BATCH_1A_NOTES.md` | Local installation instructions and handover notes | Markdown | — | Documentation | None | No |
| `BATCH_1A_FILE_MANIFEST.md` | This file | Markdown | — | Documentation | None | No |
| `BATCH_1A_VERIFICATION.md` | Static verification results and checksum record | Markdown | — | Documentation | None | No |

---

## app/ — Configuration (app root)

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `app/package.json` | NPM manifest — scripts, all dependencies, dev dependencies | JSON | 46 | Configuration | None | No |
| `app/vite.config.ts` | Vite build config — base `/pipeline/`, Vitest config, jsdom environment | TypeScript | 22 | Configuration | None | No |
| `app/tsconfig.json` | TypeScript root config — references app and node configs | JSON (JSONC) | 7 | Configuration | None | No |
| `app/tsconfig.app.json` | TypeScript app config — strict, ESNext, react-jsx, noEmit | JSON (JSONC) | 32 | Configuration | None | No |
| `app/tsconfig.node.json` | TypeScript node config — for Vite config file itself | JSON (JSONC) | 19 | Configuration | None | No |
| `app/tailwind.config.ts` | Tailwind design tokens — navy, teal, canvas, stage colours, health colours | TypeScript | 91 | Configuration | None | No |
| `app/postcss.config.js` | PostCSS config — Tailwind and Autoprefixer plugins | JavaScript | 6 | Configuration | None | No |
| `app/eslint.config.js` | ESLint flat config — typescript-eslint, react-hooks, react-refresh | JavaScript | 27 | Configuration | None | No |
| `app/.prettierrc` | Prettier formatting config | JSON | 9 | Configuration | None | No |
| `app/index.html` | Vite HTML entry point for React app — NOT the live pipeline/index.html | HTML | 20 | Configuration | None | No |

**Note on tsconfig JSONC:** `tsconfig.app.json` and `tsconfig.node.json` contain `/* block comments */`. Python's `json.load` rejects these. TypeScript's own parser accepts JSONC in tsconfig files as documented. These files are valid for their intended purpose.

---

## app/src/ — Entry Points

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `app/src/main.tsx` | React app entry — mounts RouterProvider into #root | TSX | 17 | Source | None | No |
| `app/src/router.tsx` | createHashRouter definition — all 11 routes | TSX | 120 | Source | None | No |
| `app/src/index.css` | Tailwind directives, focus-visible styles, touch target CSS, safe-area utilities | CSS | 48 | Source | None | No |

---

## app/src/types/ — TypeScript Types

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `app/src/types/index.ts` | Re-exports all types and enums from this folder | TypeScript | 8 | Source | None | No |
| `app/src/types/enums.ts` | All controlled vocabularies — DocumentStatus, LegalReviewStatus, DocumentSource, BrandingVariant, LegalReviewerType, SyncStatus, stage maps, transition maps | TypeScript | 191 | Source | None | No |
| `app/src/types/branded.ts` | Branded string types — ClientId, TemplateFileId, GeneratedDocumentFileId, DriveFileId | TypeScript | 33 | Source | None | No |
| `app/src/types/Opportunity.ts` | Opportunity interface — 30 fields (A:T legacy + U:AD extension), header arrays, schema version type, extension defaults | TypeScript | 165 | Source | None | No |
| `app/src/types/Document.ts` | Document interface — 33 fields A:AG, DOCUMENT_HEADERS array, snapshot field documentation, legal review separation enforcement | TypeScript | 125 | Source | None | No |
| `app/src/types/DocumentTemplate.ts` | DocumentTemplate interface — 17 fields A:Q, legally significant document types list, generation messages by legal review status | TypeScript | 100 | Source | None | No |
| `app/src/types/Client.ts` | Placeholder — ClientEntityResolution interface, three open questions documented | TypeScript | 43 | Source | None | No |
| `app/src/types/DriveService.ts` | Interface stubs only — drive.file capability documentation, template copy flow | TypeScript | 60 | Source | None | No |
| `app/src/types/Activity.ts` | Activity interface — 5 fields A:E, ActivityRepository interfaces | TypeScript | 32 | Source | None | No |

---

## app/src/constants/

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `app/src/constants/index.ts` | Re-exports constants | TypeScript | 2 | Source | None | No |
| `app/src/constants/company.ts` | Company constants — name, number, address, email, taglines, GHL sub-account ID, Sheets workbook ID, ALLOWED_EMAILS, GOOGLE_CLIENT_ID | TypeScript | 43 | Source | None | **See note** |
| `app/src/constants/stages.ts` | Stage definitions, colours, display labels | TypeScript | 62 | Source | None | No |

**Note on company.ts:** Contains `GOOGLE_CLIENT_ID` (the public OAuth client ID `1021401833054-kj021cr7g7tqbmpjmbtar2heu1kblao6.apps.googleusercontent.com`). This is a known public value required to identify the OAuth application — it is not a secret. It is explicitly identified in the secret scan. No edit required unless the OAuth application changes.

---

## app/src/contexts/

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `app/src/contexts/AuthContext.tsx` | Google Identity Services token client implementation — all 7 auth failure states, memory-only token, ALLOWED_EMAILS gate, pre-expiry reauth, pendingState | TSX | 288 | Source | None | No |

---

## app/src/services/

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `app/src/services/GoogleSheetsService.ts` | Google Sheets v4 API wrapper — getRange, putRange, appendRows, clearRange, getWorkbookMetadata, addSheetTab, updateCell, GoogleSheetsError | TypeScript | 129 | Source | None | No |
| `app/src/services/OpportunityRepository.ts` | Opportunity data layer — parseOpportunityRow, serialiseOpportunityRow, detectSchemaVersion, buildMigrationPreview (dry-run only), validateHeaderOrder | TypeScript | 285 | Source | None | No |
| `app/src/services/ActivityRepository.ts` | Activity data layer — getAll, append | TypeScript | 77 | Source | None | No |
| `app/src/services/MockDataService.ts` | Read-only mock data — 4 authorised clients, isMockMode(), assertMockModeForWrites() | TypeScript | 232 | Source | `VITE_USE_MOCK_DATA` | No |

---

## app/src/components/

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `app/src/components/AppShell.tsx` | Root layout — auth gate, skip link, mock banner, responsive split, Outlet | TSX | 75 | Source | None | No |
| `app/src/components/AppHeader.tsx` | Top bar — company name, user email, sign-out | TSX | 49 | Source | None | No |
| `app/src/components/DesktopSidebar.tsx` | Persistent sidebar — 7 nav items, hidden below lg, NavLink aria-current | TSX | 85 | Source | None | No |
| `app/src/components/MobileBottomNav.tsx` | Bottom nav — 5 items, safe-area padding, 56px minimum height | TSX | 64 | Source | None | No |
| `app/src/components/AuthScreen.tsx` | Sign-in screen — Google SVG icon, unauthorised message, error display | TSX | 85 | Source | None | No |
| `app/src/components/ErrorState.tsx` | Error display — role="alert", reconnect prompt for auth errors | TSX | 55 | Source | None | No |
| `app/src/components/LoadingState.tsx` | Loading indicator — accessible spinner | TSX | 21 | Source | None | No |
| `app/src/components/RoutePlaceholder.tsx` | Placeholder for unimplemented views — role="region", aria-label, aria-hidden decorative icons | TSX | 34 | Source | None | No |
| `app/src/components/EmptyState.tsx` | Empty state — role="region" with aria-labelledby | TSX | 28 | Source | None | No |
| `app/src/components/PageContainer.tsx` | Consistent padding and max-width wrapper | TSX | 19 | Source | None | No |

---

## app/src/views/

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `app/src/views/TodayView.tsx` | Today dashboard — placeholder | TSX | 12 | Source | None | No |
| `app/src/views/PipelineView.tsx` | Pipeline list/Kanban — useSearchParams for ?stage= | TSX | 26 | Source | None | No |
| `app/src/views/PipelineDetailView.tsx` | Opportunity detail — useParams for :id | TSX | 14 | Source | None | No |
| `app/src/views/ClientsView.tsx` | Clients list — placeholder | TSX | 11 | Source | None | No |
| `app/src/views/ClientDetailView.tsx` | Client detail — useParams for :clientId | TSX | 14 | Source | None | No |
| `app/src/views/ClientDocumentsView.tsx` | Client documents — useParams for :clientId, disabled pending client entity decision | TSX | 14 | Source | None | No |
| `app/src/views/EngagementsView.tsx` | Engagements — placeholder | TSX | 11 | Source | None | No |
| `app/src/views/TasksView.tsx` | Tasks — placeholder | TSX | 11 | Source | None | No |
| `app/src/views/RevenueView.tsx` | Revenue — placeholder | TSX | 11 | Source | None | No |
| `app/src/views/SettingsView.tsx` | Settings — links to archived view | TSX | 23 | Source | None | No |
| `app/src/views/SettingsArchivedView.tsx` | Archived opportunities — placeholder | TSX | 11 | Source | None | No |

---

## app/src/__tests__/

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `app/src/__tests__/setup.ts` | Vitest setup — @testing-library/jest-dom matchers | TypeScript | 17 | Test | None | No |
| `app/src/__tests__/opportunity-schema.test.ts` | Opportunity parser, serialiser, schema detection, migration preview, real data values | TypeScript | 522 | Test | None | No |
| `app/src/__tests__/document-types.test.ts` | Document and template type assertions — 33 fields, snapshot columns, Final≠reviewed, Signed≠reviewed | TypeScript | 304 | Test | None | No |
| `app/src/__tests__/routing.test.tsx` | All 11 routes render headings, URL params, no /pipeline/pipeline/ duplication | TSX | 200 | Test | None | No |
| `app/src/__tests__/auth.test.tsx` | All 7 auth states, ALLOWED_EMAILS, token memory, pendingState | TSX | 181 | Test | None | No |
| `app/src/__tests__/accessibility.test.tsx` | Nav landmarks, skip link, main landmark, headings, aria attributes, mobile labels | TSX | 166 | Test | None | No |

---

## worker/ — Configuration

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `worker/package.json` | Worker NPM manifest — wrangler, vitest, typescript, @cloudflare/workers-types | JSON | 17 | Configuration | None | No |
| `worker/tsconfig.json` | Worker TypeScript config — Cloudflare Workers types | JSON (JSONC) | 14 | Configuration | None | No |
| `worker/vitest.config.ts` | Worker Vitest config — node environment | TypeScript | 8 | Configuration | None | No |
| `worker/wrangler.toml` | Cloudflare Worker config — name only, no secrets, documented secret locations | TOML | 20 | Configuration | None | No |
| `worker/.dev.vars.example` | Template for local secrets — `GHL_TOKEN=` empty, copy to `.dev.vars` | Text | 13 | Configuration | `GHL_TOKEN` (empty placeholder) | **Yes** — copy to `.dev.vars` and add real token in Phase 3 only |

---

## worker/src/

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `worker/src/index.ts` | Cloudflare Worker — /health, /ghl/proxy (503), /ghl/webhook (501), /ghl/discover (503), CORS, OPTIONS preflight, 404 fallback | TypeScript | 191 | Source | `GHL_TOKEN` (via Env interface — absent is handled safely) | No |

---

## worker/src/__tests__/

| Path | Purpose | Type | Lines | Category | Env Vars | Edit Required |
|------|---------|------|-------|----------|----------|---------------|
| `worker/src/__tests__/worker.test.ts` | Worker unit tests — /health, absent-token 503, CORS, OPTIONS, 404, no live fetch, no secret leak | TypeScript | 171 | Test | None | No |

---

## Environment Variable Reference Summary

| Variable | File | Purpose | Value in archive | Action required |
|----------|------|---------|-----------------|-----------------|
| `VITE_USE_MOCK_DATA` | `MockDataService.ts` (read) | Enables mock data mode | Not set in archive | Set to `true` for local dev if desired — never set in production build |
| `GHL_TOKEN` | `worker/src/index.ts` (Env interface) | GoHighLevel API token | Absent — worker returns 503 safely | Create `worker/.dev.vars` from `.dev.vars.example`, add token in Phase 3 only |
| `GOOGLE_CLIENT_ID` | `app/src/constants/company.ts` | Public OAuth client ID | Present — `1021401833054-...` | No action — this is a public value, not a secret |

No other environment variables are referenced in the archive.

---

*End of File Manifest*
