# intiq-join

The retailer survey (the client's format, intiq_retailer_survey_v2): one welcome screen, eight short
steps, and a thank-you with the retailer's Founding Store number. Hindi by default, with Marathi, Gujarati and English. Full-screen on a phone, two panes on a computer.

## Run

```bash
npm install
npm run dev        # http://localhost:5175
```

`.env` (copy `.env.example`):

| key | what |
| --- | --- |
| `VITE_API_MODE` | `mock` (answers stay in this browser, default for `npm run dev`) or `http` (the real backend). Production builds use `http` (`.env.production`) |
| `VITE_DEV_API_TARGET` | where `/api` goes in dev, default `http://localhost:8082` |
| `VITE_CONSENT_VERSION` | sent with every answer, so we know which consent wording they agreed to |

Links can carry `?ch=whatsapp|sms|email` (which blast it came from) and `?lang=hi|mr|gu|en`.

## Where things are

```
src/
  journey/   steps.ts (the order), store.ts (answers, saved in the browser), Journey.tsx (which screen)
  welcome/   the welcome screen (the client's invitation, laid out)
  form/      confirm, details, purchase, how they buy, brands, rewards, invitation, review
  done/      thank-you + Founding Store #N
  layout/    Screen: the one layout every screen uses (phone column / computer two panes)
  shared/    api (port + http + mock), i18n (hi, mr, gu, en), ui (incl. the state Picker), art, voice, tracking, styles
```

- Adding or reordering a step: `journey/steps.ts` plus one entry in `Journey.tsx`.
- The backend changes this format needs: `docs/backend-v2-prompt.md`.
- Changing words: `shared/i18n/en.ts` (the keys), then the same key in `hi.ts`, `mr.ts` and `gu.ts`; the types
  refuse a missing one.
- Switching to the real backend needs no code change, only `VITE_API_MODE=http`.

## Going live (Amplify)

Rewrites and redirects, in this order:
1. `/api/<*>` → `https://dr8vf4y0mtfyx.cloudfront.net/api/<*>`, type `200 (Rewrite)`
2. the SPA fallback (`</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>` → `/index.html`, `200`)

## Checks

```bash
npm run lint
npm test
npm run build
```
