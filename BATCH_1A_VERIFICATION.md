# Batch 1A — Static Verification Report

**Deeray Multimedia Ltd — Pipeline Tracker Premium Rebuild**
Date: 20 July 2026
Environment: Anthropic cloud sandbox (npm registry unavailable)

---

## 1. Archive Checksum

```
SHA-256: 2f8218344128a3e8e20e1ed7d9c09475da10d26fec4d9a5aabdbec4ec85e03b6
File:    deeray-pipeline-batch-1a.zip
Size:    72 KB
```

Verify after download:
```bash
# macOS
shasum -a 256 deeray-pipeline-batch-1a.zip

# Linux
sha256sum deeray-pipeline-batch-1a.zip
```

Expected output:
```
2f8218344128a3e8e20e1ed7d9c09475da10d26fec4d9a5aabdbec4ec85e03b6  deeray-pipeline-batch-1a.zip
```

---

## 2. Per-File SHA-256 Checksums

| File | SHA-256 |
|------|---------|
| `app/.prettierrc` | `f993a10574385cdd23cf36213f7fcfa4d65a3ab35b970d7d108e126cd82323f3` |
| `app/eslint.config.js` | `7101cd43b1adb9c00069971583eea5c55d0bac3e20a997bc5fb36deb6dbe4db6` |
| `app/index.html` | `e1f05b62d58c36d2ac693ee56dcdc4a85fbf68d7360faebda9ad2bb76cf2d9b8` |
| `app/package.json` | `93086c097bab77860d2eae2fac68abda1c8368ce2507c3a0ebead1d07ad486b4` |
| `app/postcss.config.js` | `e32657baf631d7c5f4dc67b4b2ee0ec8e7d5b3c41860e09cddce7c0377cd80bc` |
| `app/tailwind.config.ts` | `11d8ec46aae711fe08878894bd6075476420de0f12c8fcf762623295bcdc16ad` |
| `app/tsconfig.app.json` | `51553af2cadd5a91b2ae57680fd611212647de3469d9d20ed5a242fa13552aff` |
| `app/tsconfig.json` | `770b4140bbb581e2dfd9ea9946ffc9c75a1d86ba7d2db5f77c83e37cbdf9d808` |
| `app/tsconfig.node.json` | `60dc013a0238fda54c4db17e7fa25e48eb73b6aed12f7977562c310cbaba218a` |
| `app/vite.config.ts` | `9c5cf57ac146b56b79bc4f48f7ca95fca522460bb4395f5bcd542d9d0f788da7` |
| `app/src/__tests__/accessibility.test.tsx` | `ed5e1d696ebbfac3544d53c3c76824e44cd9d98f7268743152653c7967179372` |
| `app/src/__tests__/auth.test.tsx` | `bfcecff58e96c5b1eacd7a5df070f4c2cf779f899540d720b9234711d5d95462` |
| `app/src/__tests__/document-types.test.ts` | `c2fa52754b58366f12989bfbe2cf1930166fbc6f1a1e9d3560037f0a3386b1cd` |
| `app/src/__tests__/opportunity-schema.test.ts` | `a885fd72905866756088ac7cb7e42dd4802912969a9c345436f64c692fe97b8a` |
| `app/src/__tests__/routing.test.tsx` | `f324aa5c7f0cf187e8a54f1594493ac16780ab5fe72e98be85daf49314c847ce` |
| `app/src/__tests__/setup.ts` | `a8f470fefabbf56ead333c5e7f055c73a0022971e5cd7a84fceab0196b80370e` |
| `app/src/components/AppHeader.tsx` | `c988dfcf57f39a99c971d5173c104ed2b0847cf4f4d1df2f3ff9cb5e8b439eac` |
| `app/src/components/AppShell.tsx` | `bc954900aa843861bab61d5a9399d6ab0aaf9880ebffd02b7f8351ffe859a7f1` |
| `app/src/components/AuthScreen.tsx` | `3596c5d9d76fe3ee5874d4c007d174a483212ee04f3c7c57a464faa9a915c3a8` |
| `app/src/components/DesktopSidebar.tsx` | `d263d4b3ab1edc04a72c3629a3eca80596e94fe5efa30843d912eff171b0824c` |
| `app/src/components/EmptyState.tsx` | `75b5e3dffc875432c6b8406856984284b7acf002d30951c6f7f8d0ca3477ed15` |
| `app/src/components/ErrorState.tsx` | `a8c7aad1632170457e561f60a28b8556a5f12b862146782184daa72dbd047ba0` |
| `app/src/components/LoadingState.tsx` | `81ec11449959eb977cefd85d605fd313254de347a87d5e5ce949a55ca95602fd` |
| `app/src/components/MobileBottomNav.tsx` | `2e3b8cdf8a008f95c478969dfc7dcec9a2b113a3dc2b65f818df7656497a01e3` |
| `app/src/components/PageContainer.tsx` | `106adfaf505ada17bb72ba18671ca7661c0fc395148036c4c0b3314f56c91193` |
| `app/src/components/RoutePlaceholder.tsx` | `fc919dbcab13d9de2d8d27271776c8079ef1d3216964af0a60c54031c9745392` |
| `app/src/constants/company.ts` | `dbd19e92fb7f8a22fa0322fa6dd4226fe664db3a9b3bfca01a41f20bb3a7fe3e` |
| `app/src/constants/index.ts` | `b11fdd1534bcdf2e99fab92e4a6e8a894c979f4e1bfaafd0649d27ec91f62489` |
| `app/src/constants/stages.ts` | `f4ca0e4c74df13de7bccdd7b64127ef93b75f6aae55a984dac83251ad23b91bc` |
| `app/src/contexts/AuthContext.tsx` | `109294889d4dd4593b8e5cddfa37eea0dcd166656c53bbdd3a4d34babbd979d8` |
| `app/src/index.css` | `e40e495e3326cc3d4ec2368b95765cf3c5b8a4718c0b12daa77dfac14cefc7bb` |
| `app/src/main.tsx` | `c74bd1d01de6a52cede59f99bb55e6b0ebe0377ac0ec4e895bb85ea72910cecf` |
| `app/src/router.tsx` | `c1984b92d1472206ae10f2d144ad3b0a9fa3e8ef35a3dda741206c01e4ca1047` |
| `app/src/services/ActivityRepository.ts` | `34edb1fe7d13264b655d947b910f4681384bf01b8ffce87d52710712b2d8243a` |
| `app/src/services/GoogleSheetsService.ts` | `f6134436bb801055c248f1dca307a4a6bdc8fc0278020e9b87625ee355442eac` |
| `app/src/services/MockDataService.ts` | `cdc861b5f7f7db0069167faee32ba86ce6ce1289382344f210acab8014eb33c8` |
| `app/src/services/OpportunityRepository.ts` | `e412c3b60c00b4c7fb79f416996d1acf12ac106380afc0b78e02f64e37fd3a04` |
| `app/src/types/Activity.ts` | `cafbe7305f77ff53ef6c01ded7e2586593ba70d888552c82968700367caeb6d1` |
| `app/src/types/Client.ts` | `8822b809703c5175a6003f657b5c0c5fd459884a0c10a57a5cd5042f3d253200` |
| `app/src/types/Document.ts` | `7646a69640e0f797014f9f17e4e87432af9f3217ca519aef6eac8cc7cee3d1bb` |
| `app/src/types/DocumentTemplate.ts` | `43582ac81d4e247591ac3bfac8f6969bfab7a1eb03739e9a475faa0cc6dd9a13` |
| `app/src/types/DriveService.ts` | `563fe63acb94b1c3e24e84ff45b454815b31480744b0434393215cf29efa12b4` |
| `app/src/types/Opportunity.ts` | `ba2fdf20942d836e37f32a599d79bab78c30a452305e704dcc210365868ff939` |
| `app/src/types/branded.ts` | `c106108f8f2af58d0f5a765f52c0bcf7551555f7262f89ea6e1170550070c7aa` |
| `app/src/types/enums.ts` | `86647c98f5e5646a1a32de05e48b0686f4eb6f4becf9ea57a39ed6890e14f96c` |
| `app/src/types/index.ts` | `632ca8db07eefb64397a8e5bbe4878605c58fc04cb34c13114da1295c7a6f629` |
| `app/src/views/ClientDetailView.tsx` | `11bce999c3daf30cc5b3cde4f0649e01f76c4da57faef23be340d423178a6f66` |
| `app/src/views/ClientDocumentsView.tsx` | `cfdf305abfcfa25761b52a5d01bb8d880abf510defe9a40b5100b8197012b462` |
| `app/src/views/ClientsView.tsx` | `80c40497cdc9d4b15ae05a0d3d8d435c423faaa8899649ffd4d1ac229f57ef00` |
| `app/src/views/EngagementsView.tsx` | `2bdba198fada56de9dc073265280e75edf34bd5b0d48778509f2d6b388cdb303` |
| `app/src/views/PipelineDetailView.tsx` | `222a3ebcd4c59e21ce5fa7971efe071932383d97bfa37f3f7ea261200ac5b3bf` |
| `app/src/views/PipelineView.tsx` | `bcd25da300c59572d43b89cb63116e660e2b5c9e81e8a9c2652d3858fe691d7b` |
| `app/src/views/RevenueView.tsx` | `354102abdff938642e4ee7d976626edbad6a4d0c609d009451ded859daf139d7` |
| `app/src/views/SettingsArchivedView.tsx` | `af56b10ca7b499c0c35d3a107d1e961995a387c2e4fe4571bfecb93ed40ceb94` |
| `app/src/views/SettingsView.tsx` | `53fc7ed30f693eafcc2c1878475263f2d91c5dee4bda024c78b5b148eecc913b` |
| `app/src/views/TasksView.tsx` | `24f02c36f48c17a337beb9be3f89f4a1ed576203f26ec74ecc1f74d4a5ce17e9` |
| `app/src/views/TodayView.tsx` | `535ae6c42e9172fcce59a1b9087a9bf27673fc46410eea06b0ff72f2a549741e` |
| `worker/.dev.vars.example` | `f53d669d3ab02133e7f2ff98cb82ca66f7c1210772d0955576dae32bd54ad367` |
| `worker/package.json` | `2059caccf8676032f2b64aff1196c8d58a5b9171df932dd7b40fe96145fcbbfc` |
| `worker/src/__tests__/worker.test.ts` | `c660b946a1e4f912463bde97cfcc366c694cacba04a47203299b1919bb16151f` |
| `worker/src/index.ts` | `3d626f46ddc77dddc5ed436653b6059f964df74cec61a0da56a549db943ad085` |
| `worker/tsconfig.json` | `0f9f872b9e01a9ee673ce3f6b0fb295eae8eb94bb1b8f624c65648f17ea292ca` |
| `worker/vitest.config.ts` | `9e3e419416bff80157d7afaba5e20037e55cb1ce3fc259963a8fa81396139967` |
| `worker/wrangler.toml` | `9a5403ef6fdcb738254f14df7b0b6094e345b0329ccec36aca6f0143d0d94ab3` |

---

## 3. Static Verification Results

All checks listed below were performed using Python scripts, the `unzip` utility, and shell commands running in the cloud environment. No npm packages were installed.

### 3.1 — Empty File Check
**Method:** `wc -l` on all `.ts` and `.tsx` files, filtered for zero-line results.
**Result:** `NO_EMPTY_FILES` — All 51 TypeScript and TSX source files contain content.

### 3.2 — Placeholder Check
**Method:** `grep -r "TODO_IMPLEMENT_THIS_FILE"` across all source files.
**Result:** `NONE` — No unimplemented placeholder strings found.

### 3.3 — Curly/Smart Quote Check (binary scan)
**Method:** Binary scan for UTF-8 sequences `\xe2\x80\x98` ('), `\xe2\x80\x99` ('), `\xe2\x80\x9c` ("), `\xe2\x80\x9d` (") in all source files.
**Result:** `NO_CURLY_QUOTES_IN_ANY_SOURCE_FILE`

Note: An initial text-based scan reported false positives. The binary scan confirmed the files contain no curly quotes. Em and en dashes (`—`, `–`) appear only inside `//` comment lines, not in string literals or code paths.

### 3.4 — Markdown Fence Check
**Method:** `grep -rn '^\`\`\`'` in `.ts` and `.tsx` files.
**Result:** `NONE` — No Markdown code fences inside source files.

### 3.5 — Local Import Resolution
**Method:** Python script resolving all relative `from '...'` imports against actual filesystem, checking `.tsx`, `.ts`, `/index.tsx`, and `/index.ts` candidates.
**Files checked:** 51
**Total local imports:** 101
**Result:** `ALL_LOCAL_IMPORTS_RESOLVED` — Every local import path resolves to a file that exists in the archive.

### 3.6 — Circular Import Detection
**Method:** Python DFS over import graph built from all local imports.
**Result:** `NO_CIRCULAR_IMPORTS_DETECTED`

### 3.7 — JSON Validity
**Method:** Python `json.load()` on all `.json` files.

| File | Result |
|------|--------|
| `app/package.json` | VALID |
| `app/tsconfig.json` | VALID |
| `worker/package.json` | VALID |
| `worker/tsconfig.json` | VALID |
| `app/tsconfig.app.json` | JSONC — see note |
| `app/tsconfig.node.json` | JSONC — see note |

**JSONC note:** `tsconfig.app.json` and `tsconfig.node.json` contain `/* block comments */`. Standard `json.load()` rejects these. TypeScript's own parser accepts JSONC in `tsconfig` files by specification. These files are valid for their intended purpose. They are not invalid; Python's parser does not support JSONC.

### 3.8 — Duplicate File Paths
**Method:** `find | sort | uniq -d`
**Result:** `NO_DUPLICATES`

### 3.9 — Absolute Cloud Workspace Paths
**Method:** `grep -rn "/root/deeray-pipeline\|/home/claude\|/root/.claude"` in all source files.
**Result:** `NONE` — No cloud workspace paths remain in any source file.

### 3.10 — No Accidental `index.html` in Repository Root
**Method:** `ls -la` at workspace root.
**Result:** CONFIRMED — No `index.html` exists at the root of the scaffold. The file at `app/index.html` is the new Vite entry point only.

### 3.11 — tsconfig Files Include Correct Source Folders
**Method:** File read and review.
**`app/tsconfig.app.json` includes:** `src/**/*` — correct.
**`app/tsconfig.node.json` includes:** `vite.config.ts` — correct.
**`worker/tsconfig.json` includes:** `src/**/*` — correct.

### 3.12 — Vitest Configuration
**Method:** File read and review.
**`app/vite.config.ts` test config:** `globals: true`, `environment: 'jsdom'`, `setupFiles: ['./src/__tests__/setup.ts']` — correct.
**`worker/vitest.config.ts` test config:** `globals: true`, `environment: 'node'` — correct.
Both configs use `vitest/config` imports and `defineConfig`. Pattern for test discovery is default (`**/*.{test,spec}.{ts,tsx}`), which covers all test files.

### 3.13 — Package.json Script Names Match Handover Instructions
| Script | app/package.json | worker/package.json |
|--------|-----------------|---------------------|
| `dev` | `vite` | `wrangler dev` |
| `build` | `tsc -b && vite build` | — |
| `test` | `vitest run` | `vitest run` |
| `type-check` | `tsc --noEmit` | `tsc --noEmit` |
| `lint` | `eslint src --ext .ts,.tsx ...` | — |
| `preview` | `vite preview` | — |
| `deploy` | — | `wrangler deploy` |

All commands referenced in `BATCH_1A_NOTES.md` (`npm run type-check`, `npm run lint`, `npm test`, `npm run build`) correspond to real script entries.

### 3.14 — React Router createHashRouter Support
**Method:** File read and review.
`app/package.json` lists `react-router-dom: ^6.26.0`. `createHashRouter` was introduced in React Router 6.4. Version 6.26.0 supports it. `app/src/router.tsx` imports and calls `createHashRouter` directly.

### 3.15 — Vite Base Path Configuration
**Method:** File read.
`app/vite.config.ts`: `base: '/pipeline/'` — correct for GitHub Pages deployment at `https://deeraymultimedia.github.io/pipeline/`.
Local development ignores this base and serves from root (`/`), which is expected Vite behaviour.

### 3.16 — Worker Types Included
**Method:** File read.
`worker/package.json` devDependencies include `@cloudflare/workers-types: ^4.20240909.0`.
`worker/tsconfig.json` includes `"types": ["@cloudflare/workers-types"]`.

### 3.17 — Route Tree Verification

All 11 routes confirmed in `app/src/router.tsx`:

| Hash Path | Component | File | Placeholder |
|-----------|-----------|------|-------------|
| `#/` | `TodayView` | `views/TodayView.tsx` | Yes |
| `#/pipeline` | `PipelineView` | `views/PipelineView.tsx` | Partial — renders heading + `?stage=` param |
| `#/pipeline/:id` | `PipelineDetailView` | `views/PipelineDetailView.tsx` | Yes |
| `#/clients` | `ClientsView` | `views/ClientsView.tsx` | Yes |
| `#/clients/:clientId` | `ClientDetailView` | `views/ClientDetailView.tsx` | Yes |
| `#/clients/:clientId/documents` | `ClientDocumentsView` | `views/ClientDocumentsView.tsx` | Yes |
| `#/engagements` | `EngagementsView` | `views/EngagementsView.tsx` | Yes |
| `#/tasks` | `TasksView` | `views/TasksView.tsx` | Yes |
| `#/revenue` | `RevenueView` | `views/RevenueView.tsx` | Yes |
| `#/settings` | `SettingsView` | `views/SettingsView.tsx` | Partial — links to /settings/archived |
| `#/settings/archived` | `SettingsArchivedView` | `views/SettingsArchivedView.tsx` | Yes |

**`/pipeline/pipeline/:id` duplication:** Confirmed absent. The route tree uses `path: 'pipeline'` with child `path: ':id'`. React Router resolves this as `#/pipeline/:id`. Vite's `base: '/pipeline/'` is not part of the React Router tree.

---

## 4. Schema Verification

### 4.1 — Opportunity Model
**File:** `app/src/types/Opportunity.ts`

- `OPPORTUNITY_HEADERS_V3`: 20 fields (A:T) — VERIFIED by array definition
- `OPPORTUNITY_EXTENSION_HEADERS`: 10 fields (U:AD) — VERIFIED
- `OPPORTUNITY_HEADERS_FULL`: 30 fields combined — VERIFIED
- `EXTENSION_FIELD_DEFAULTS`: all 10 extension fields defaulted — VERIFIED
- Schema version detection: `v3_legacy | v3_partial | v3_full` — VERIFIED in `OpportunityRepository.ts`
- Header-based mapping (not positional) — VERIFIED in `parseOpportunityRow`
- Legacy-row handling (A:T only): fills extension fields with defaults — VERIFIED
- Partial-row handling: fills remaining extension fields with defaults — VERIFIED
- Full-row handling (A:AD): reads all 30 fields — VERIFIED

### 4.2 — Document Model
**File:** `app/src/types/Document.ts`

- `DOCUMENT_HEADERS`: 33 fields (A:AG) — VERIFIED (field count: 33)
- Final 7 columns:

| Position | Index | Column | Field |
|----------|-------|--------|-------|
| 27 | 26 | AA | `legal_review_status` |
| 28 | 27 | AB | `legal_reviewer_name` |
| 29 | 28 | AC | `legal_reviewer_type` |
| 30 | 29 | AD | `legal_review_notes` |
| 31 | 30 | AE | `template_legal_review_status_at_generation` |
| 32 | 31 | AF | `template_legal_reviewed_at_generation` |
| 33 | 32 | AG | `template_version_at_generation` |

- `template_legal_reviewed_at_generation` is column AF (index 31) — its own column, NOT inside `legal_review_notes` — VERIFIED
- All three snapshot fields (AE, AF, AG) are separate columns — VERIFIED
- Critical enforcement comments present in source:
  - `Final does NOT mean legally reviewed` — VERIFIED in file
  - `Signed does NOT mean legally reviewed` — VERIFIED in file

### 4.3 — DocumentTemplate Model
**File:** `app/src/types/DocumentTemplate.ts`

- `DOCUMENT_TEMPLATE_HEADERS`: 17 fields (A:Q) — VERIFIED
- `LegalReviewStatus` is separate from `DocumentStatus` — VERIFIED in `enums.ts`
- `LEGALLY_SIGNIFICANT_DOCUMENT_TYPES`: 9 document types requiring acknowledgement — VERIFIED
- `LEGAL_REVIEW_GENERATION_MESSAGES`: message per LegalReviewStatus value — VERIFIED

### 4.4 — Enum Completeness

| Enum | Values | Count | Verified |
|------|--------|-------|---------|
| `DocumentStatus` | Draft, In Review, Final, Sent, Viewed, Signed, Superseded, Archived | 8 | Yes |
| `LegalReviewStatus` | not_applicable, not_reviewed, internal_review, professional_review_pending, professionally_reviewed, review_expired, superseded | 7 | Yes |
| `DocumentSource` | tracker_generated, drive_linked, drive_uploaded, external_link, ghl_document, ghl_media | 6 | Yes — `manual_link` absent |
| `LegalReviewerType` | internal, external_solicitor, client_legal_team, other_professional | 4 | Yes |
| `BrandingVariant` | formal, correspondence, invoice, internal | 4 | Yes |
| `SyncStatus` | never, pending, syncing, synced, failed, conflict | 6 | Yes |

---

## 5. Secret Scan Results

**Method:** Python regex pattern scan over all `.ts`, `.tsx`, `.toml`, `.json`, `.js`, `.html`, `.css`, `.md`, `.example` files.

**Patterns scanned:**
- GHL token value pattern (`GHL_TOKEN=<value>`)
- Google access token (`ya29.*`)
- JWT tokens (`eyJ*.eyJ*.*`)
- PEM private key blocks (`-----BEGIN ... PRIVATE KEY-----`)
- OAuth client secret patterns
- Google OAuth client secret prefix (`GOCSPX-`)
- Google API key pattern (`AIza...`)
- Webhook secret patterns
- Hardcoded passwords
- Email addresses
- `worker/.dev.vars` file existence

### Results

**Dangerous / Unknown Secrets: NONE**

No GHL tokens, Google access tokens, JWT tokens, private keys, OAuth client secrets, API keys, webhook secrets, or passwords were found.

**Known-safe values explicitly identified:**

| Value | Location | Classification |
|-------|----------|----------------|
| `1021401833054-kj021cr7g7tqbmpjmbtar2heu1kblao6.apps.googleusercontent.com` | `app/src/constants/company.ts:37` | PUBLIC — Google OAuth client ID. Required to identify the OAuth application. Not a secret. |
| `adegisanrin@gmail.com` | `constants/company.ts`, `__tests__/auth.test.tsx`, `__tests__/accessibility.test.tsx`, `__tests__/routing.test.tsx` | AUTHORISED USER — listed in `ALLOWED_EMAILS`. Expected to appear. |
| `sales@deeraymultimedia.co.uk` | `constants/company.ts` | COMPANY CONTACT — public contact detail. Not sensitive. |
| `support@deeraymultimedia.co.uk` | `constants/company.ts` | COMPANY CONTACT — public contact detail. Not sensitive. |

**Test/mock email addresses (not real client data):**

| Value | Location | Classification |
|-------|----------|----------------|
| `contact@example.com` | `MockDataService.ts` (4 occurrences) | MOCK PLACEHOLDER — example.com test domain. Not a real email. |
| `demo@example.com` | `MockDataService.ts` | MOCK PLACEHOLDER — example.com test domain. |
| `test@example.com` | `opportunity-schema.test.ts` | TEST FIXTURE — not a real client email. |
| `attacker@example.com` | `auth.test.tsx` (3 occurrences) | TEST FIXTURE — used specifically to test that the unauthorised email is rejected. |

**`worker/.dev.vars` existence:** `DOES NOT EXIST` — correct.
**`.gitignore` coverage:** `worker/.dev.vars`, `.env`, `node_modules` — all present in `.gitignore`.

---

## 6. Test Status Classification

Tests were written and structured but could not be executed because the npm registry is blocked in the cloud environment. No package could be installed.

| Test Suite | File | Tests Written | Status |
|------------|------|--------------|--------|
| Opportunity schema | `app/src/__tests__/opportunity-schema.test.ts` | ~35 | NOT RUN — npm registry unavailable |
| Document types | `app/src/__tests__/document-types.test.ts` | ~30 | NOT RUN — npm registry unavailable |
| Routing | `app/src/__tests__/routing.test.tsx` | ~15 | NOT RUN — npm registry unavailable |
| Authentication | `app/src/__tests__/auth.test.tsx` | ~20 | NOT RUN — npm registry unavailable |
| Accessibility | `app/src/__tests__/accessibility.test.tsx` | ~15 | NOT RUN — npm registry unavailable |
| Worker | `worker/src/__tests__/worker.test.ts` | ~15 | NOT RUN — npm registry unavailable |

TypeScript type-check: `NOT RUN — npm registry unavailable`
ESLint: `NOT RUN — npm registry unavailable`
Vite build: `NOT RUN — npm registry unavailable`

All tests require local execution after `npm install`.

---

## 7. Package Configuration Review

### 7.1 — app/package.json

All packages declared. Key version notes:

| Package | Version | Notes |
|---------|---------|-------|
| `react` | `^18.3.1` | React 18 — required |
| `react-dom` | `^18.3.1` | Matches React version |
| `react-router-dom` | `^6.26.0` | Supports `createHashRouter` (added in 6.4) |
| `vite` | `^5.4.1` | Vite 5 — required |
| `typescript` | `^5.5.3` | TypeScript 5 strict |
| `tailwindcss` | `^3.4.10` | Tailwind 3 — compatible with PostCSS config |
| `vitest` | `^2.0.5` | Vitest 2 — compatible with Vite 5 |
| `@testing-library/react` | `^16.0.0` | RTL 16 — compatible with React 18 |
| `jsdom` | `^25.0.0` | Required for Vitest jsdom environment |
| `@vitejs/plugin-react` | `^4.3.1` | Compatible with Vite 5 and React 18 |
| `chart.js` | `^4.4.0` | Chart.js 4 — for revenue/pipeline charts (Batch 1B) |

### 7.2 — worker/package.json

| Package | Version | Notes |
|---------|---------|-------|
| `wrangler` | `^3.78.0` | Cloudflare Workers CLI |
| `@cloudflare/workers-types` | `^4.20240909.0` | TypeScript types for Worker APIs |
| `vitest` | `^2.0.5` | Worker unit testing |
| `typescript` | `^5.5.3` | TypeScript 5 strict |

### 7.3 — wrangler.toml

Contains: `name = "deeray-pipeline-worker"` and `compatibility_date`.
Does NOT contain: `[vars]` with secret values. No `GHL_TOKEN` value.
Comments document that secrets go in `worker/.dev.vars` (local) or Cloudflare dashboard (production).

---

## 8. Verification Limitations

The following checks could not be performed in the cloud environment and require local execution:

| Check | Reason | Required action |
|-------|--------|-----------------|
| TypeScript compilation | `tsc` not available without `npm install` | Run `cd app && npm run type-check` |
| ESLint | Not available without `npm install` | Run `cd app && npm run lint` |
| Vitest (app) | Not available without `npm install` | Run `cd app && npm test` |
| Vitest (worker) | Not available without `npm install` | Run `cd worker && npm test` |
| Vite build | Not available without `npm install` | Run `cd app && npm run build` |
| React render correctness | Requires jsdom + RTL | Run app tests |
| Node version compatibility | Cannot check without local env | Confirm Node ≥ 18.x |

---

## 9. Confirmation Statements

| Item | Status |
|------|--------|
| Batch 1B has not begun | CONFIRMED |
| Live Google Sheets unchanged | CONFIRMED — no API calls made |
| Live GHL unchanged | CONFIRMED — no calls made, no token used |
| Google Drive unchanged | CONFIRMED — no calls made |
| OAuth scopes unchanged | CONFIRMED — no scope additions |
| Production `index.html` unchanged | CONFIRMED — not accessed |
| `main` branch unchanged | CONFIRMED — repository not accessed in this environment |
| No commit made | CONFIRMED |
| No push made | CONFIRMED |
| No deployment made | CONFIRMED |

---

*End of Static Verification Report*
