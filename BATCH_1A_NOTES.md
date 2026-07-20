# Batch 1A — Developer Notes

## Prerequisites

| Requirement | Minimum version | Recommended |
|-------------|----------------|-------------|
| Node.js | 18.x LTS | 20.x LTS |
| npm | 9.x | 10.x |
| Wrangler (Cloudflare) | 3.x | Latest 3.x |

To install Wrangler (required for Worker local development only, not for app):
```bash
npm install -g wrangler
```

---

## Applying this scaffold to the repository

The archive `deeray-pipeline-batch-1a.zip` must be extracted inside a clean clone of the repository. Follow this exact sequence.

### Step 1 — Prepare the repository

```bash
# Clone (or use your existing clone)
git clone https://github.com/deeraymultimedia/pipeline.git
cd pipeline

# Ensure main is current
git checkout main
git pull --ff-only

# Record the starting commit hash — keep this for the verification record
git rev-parse HEAD

# Create the feature branch
git checkout -b feat/premium-rebuild
```

### Step 2 — Extract the archive

Extract `deeray-pipeline-batch-1a.zip` into the repository root. The archive contains:

```
app/
worker/
.gitignore
BATCH_1A_NOTES.md
BATCH_1A_FILE_MANIFEST.md
BATCH_1A_VERIFICATION.md
```

If your repository already has a `.gitignore`, merge rather than replace it. Ensure `worker/.dev.vars` is present in the final `.gitignore`.

### Step 3 — Install and verify the app

```bash
cd app
npm install
npm run type-check
npm run lint
npm test
npm run build
```

All five commands must complete without errors before proceeding. Record results in the verification template at the end of this document.

### Step 4 — Install and verify the Worker

```bash
cd ../worker
npm install
npm run type-check
npm test
```

All three commands must complete without errors before proceeding.

### Step 5 — Verify index.html is unchanged

```bash
# From the repository root
git diff HEAD -- index.html
```

This command must produce no output. If it shows any diff, stop and investigate before continuing.

---

## Starting the app locally

```bash
cd app
npm run dev
```

The app starts at `http://localhost:5173`. It will request Google sign-in. Only `adegisanrin@gmail.com` is authorised to sign in.

The hash router means routes appear as:
- `http://localhost:5173/#/`
- `http://localhost:5173/#/pipeline`
- `http://localhost:5173/#/clients`

The Vite base path `/pipeline/` is not used in local development — that is for the production GitHub Pages URL only.

---

## Starting the Worker locally

```bash
cd worker
cp .dev.vars.example .dev.vars
# Do NOT add GHL_TOKEN yet — leave it blank until Phase 3
npm run dev
```

The Worker starts at `http://localhost:8787`.

Check it is running:
```bash
curl http://localhost:8787/health
```

Expected response:
```json
{
  "status": "ok",
  "routes": {
    "/ghl/proxy": "not_implemented",
    "/ghl/webhook": "not_implemented",
    "/ghl/discover": "not_implemented"
  }
}
```

The GHL routes return 503 (token absent) or 501 (not yet implemented). This is correct behaviour for Batch 1A.

---

## Mock data mode

To run the app with local mock data instead of live Google Sheets:

```bash
cd app
VITE_USE_MOCK_DATA=true npm run dev
```

A mock banner will appear at the top of the app. Write operations are blocked with a thrown error. Mock data contains four authorised clients with confirmed values.

### Confirming mock mode cannot reach production

Mock mode is enabled only by the `VITE_USE_MOCK_DATA` build-time environment variable. Because Vite replaces `import.meta.env.VITE_USE_MOCK_DATA` at build time:

- A production build (`npm run build`) with `VITE_USE_MOCK_DATA` unset will compile `isMockMode()` to `false`.
- The mock data service is tree-shaken from the production bundle if not referenced.
- To confirm: `npm run build` then inspect `dist/assets/*.js` for `mock` strings.

---

## Stopping local services

```bash
# Stop Vite dev server:
Ctrl+C in the app terminal

# Stop Wrangler dev:
Ctrl+C in the worker terminal
```

---

## Secret management

`worker/.dev.vars` contains local development secrets. It must never be committed.

Verify:
```bash
git status worker/.dev.vars
```

Expected output: `nothing to commit` or the file is listed as ignored.

If git shows `.dev.vars` as an untracked file, check `.gitignore` contains `worker/.dev.vars`.

The GHL_TOKEN must not be added until Phase 3. At that point, the exact secure storage method will be provided.

---

## Local Verification Result Template

Fill in after completing Steps 3 and 4 above and return for review before Batch 1B is authorised.

```
=== BATCH 1A LOCAL VERIFICATION RESULTS ===

Date:
Operator:
Repository clone path:
Starting commit (git rev-parse HEAD before branch):

Node version:
npm version:

--- App ---
npm install:          [ PASS / FAIL ]
type-check:           [ PASS / FAIL / WARNINGS ]
lint:                 [ PASS / FAIL / WARNINGS ]
test (vitest run):    [ PASS / FAIL — X passed, Y failed ]
build:                [ PASS / FAIL ]

--- Worker ---
npm install:          [ PASS / FAIL ]
type-check:           [ PASS / FAIL / WARNINGS ]
test (vitest run):    [ PASS / FAIL — X passed, Y failed ]

--- Repository ---
index.html unchanged: [ CONFIRMED / DIFF FOUND ]
No secrets committed: [ CONFIRMED / ISSUES ]

--- Failures and warnings ---
(list any failures, error messages, or unexpected warnings here)

--- Files changed locally ---
(list any files you had to modify to get things working)

=== END ===
```

---

## What is NOT in this scaffold (by design)

- No changes to `index.html` in the repository root (live app preserved byte-for-byte)
- No live Google Sheets calls
- No Drive integration
- No OAuth scope changes
- No GHL calls or GHL token
- No Documents worksheet
- No Document Templates worksheet
- No deployment configuration
- No committed `worker/.dev.vars`
- No binary files
- No committed fixture files

---

## Batch 1B gates

Do not authorise Batch 1B until ALL of the following are confirmed:

1. ZIP has been delivered and checksum verified
2. Files copied into `feat/premium-rebuild`
3. `npm install` succeeds in both `app/` and `worker/`
4. TypeScript passes in both
5. Lint passes
6. All tests pass
7. App build passes
8. `git diff HEAD -- index.html` shows nothing
9. No secrets committed or staged
10. No live system has changed

The client-entity and stage-mapping decisions may be resolved after the scaffold is verified, but before any live schema or integration changes begin.
