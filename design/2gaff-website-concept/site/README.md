# 2Gaff homepage: "The Front Door", fun edition

The production-ready version of the homepage chosen on 25 September 2026: the Front Door concept made more playful, with the filmed hero video. It is **not live yet**. The owner decided to publish it only after Apple and Google have approved the apps, because store reviewers are told to sign in at www.2gaff.com.

`desktop-overview.jpg` and `mobile-overview.jpg` are full-length screenshots of the reduced-motion (still) rendering.

## Files

| Path | What it is |
|------|------------|
| `index.html` | The page. One responsive layout for desktop, tablet and phone |
| `www/css/site.css` | All styles. Brand tokens are CSS variables at the top |
| `www/js/site.js` | Hand-off to the app (see below), video sync, pause button, mobile menu, scroll reveals |
| `www/fonts/` | Fraunces and Figtree (SIL Open Font License 1.1), copied from the app's `@expo-google-fonts` packages |
| `www/media/` | Hero video (`hero-day*.webm/mp4`, 1080p for desktop, 540p for phones via `<source media>`), poster, photos, Google Play badge |

Everything is served from the site itself. It fits the live content policy in `apps/mobile/public/_headers`: no inline scripts, no outside fonts, and video from `'self'`.

## Preview locally

```bash
cd design/2gaff-website-concept/site && python3 -m http.server 8767
```

Then open http://127.0.0.1:8767/. The buttons point at `/app`, which doesn't exist in this preview.

## How it replaces the current homepage

Today www.2gaff.com is the Expo web export of the app (Cloudflare Pages project `2gaff-com`), so the signed-out app is the homepage. The plan:

1. **The app moves to `/app`.** After `expo export --platform web`, rename `dist/web/index.html` to `dist/web/app.html` (Pages serves it at `/app`). Then copy this folder's `index.html` and `www/` into `dist/web/`. `/captcha`, `/help`, `/privacy`, `/terms`, `/support` and `/delete-account` stay where they are.
2. **App traffic is handed over.** `site.js` sends these visitors from `/` to `/app`, keeping the query string and hash:
   - joining links (`?join=CODE`)
   - Google/Apple sign-in returns (`?code=`, `?error=`, or `#access_token=`)
   - anyone with a stored Supabase session (`sb-*-auth-token` in local storage)

   `/?home` shows the homepage even when signed in.
3. **Check the app works under `/app`.**
   - Supabase `redirectTo` / `publicWebUrl` currently return to the site root. That still works because of step 2, but pointing it at `/app` avoids a hop.
   - Confirm the Supabase and Turnstile allowed URLs include what's used.
   - Check that signing out, and any link to `/`, behaves.
4. **Test on a Pages preview deployment** (`wrangler pages deploy dist/web --project-name 2gaff-com --branch homepage-preview`), not production. Run these tests:
   - homepage, `/app` sign-in screen and `?join=` hand-off
   - `/captcha`, help and legal pages
   - phone and desktop

   Sign-in itself may not work on the preview hostname if Supabase or Turnstile don't allow it; test that on production straight after the switch.
5. **Publish** with `--branch production` after both stores approve, with the owner's yes. Roll back by redeploying the previous Pages deployment.

## Content to confirm before publishing

- **Sample wording:** "Alder Court", "Residents' lounge", "flat 4B", the step-ladder listing and the four hero messages are samples.
- **Google Play badge:** links to `com.deeraymultimedia.twogaff`. It works once Google approves the app.
- **Property-team links:** "Set up your building" goes to `/support`, and "Team sign in" goes to `/app`.
- **Footer credit:** "App and Website Built and Powered By Deeray Multimedia".
