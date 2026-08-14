# Stephen Agyemang — Portfolio

Personal portfolio site built with **React** and **Vite 7** — a terminal/HUD-inspired interface with an AI chatbot that answers questions about my work using live GitHub data.

**Live:** [stephenagyemang.com](https://stephenagyemang.com)

## Features

- **Project Discovery chatbot** — streaming AI assistant that answers questions about my projects, grounded in live GitHub repo data rather than a static script
- **Email Draft Assistant** — generates a tailored outreach draft from a short prompt
- **Interactive skills graph** — force-directed, drag-enabled canvas on desktop; static grid on mobile
- **Project showcase** — per-project color theming with embedded live demo modals
- **Dual theme** — dark/light switcher, persisted to `localStorage`
- **HUD aesthetic** — animated telemetry bar, rotating reticle frame, ambient glow layers

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7 |
| Styling | CSS custom properties (no framework) |
| Icons | react-icons |
| Fonts | Inter + DM Mono, self-hosted via `@fontsource` |
| AI | OpenAI `gpt-5.6-luna` (streaming) |
| Backend | Vercel Serverless Functions |
| Chat logs | Cloud Firestore (`firebase-admin`) |
| Hosting | Firebase Hosting (static) + Vercel (API) |

## Architecture

The static site and the API live on **different hosts**. [`aiService.js`](stephen-portfolio/src/services/aiService.js) calls the Vercel functions by absolute URL, so the API works no matter who serves the frontend:

```mermaid
graph LR
    U[Browser] -->|static assets| F[Firebase Hosting]
    U -->|/api/chat, /api/email| V[Vercel Functions]
    V --> O[OpenAI API]
    V --> G[GitHub API]
    V --> FS[(Firestore chat logs)]
```

This is deliberate — Firebase Hosting serves static files only, and rewriting the serverless functions as Cloud Functions would mean putting the project on the Blaze plan for no real gain.

## Getting Started

```bash
cd stephen-portfolio
npm install
npm run dev           # http://localhost:5173
```

Vite's dev server serves the frontend only. Since `aiService.js` points at the deployed Vercel URL, **the AI features work in local dev without running a backend** — they call production. To run the functions locally instead, use `vercel dev` and repoint those fetch calls.

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the built bundle locally |
| `npm run lint` | ESLint |

## Environment Variables

Server-side only — read by the Vercel functions, never bundled into the client. Set them in the Vercel project settings, and in `stephen-portfolio/.env.local` for local function development.

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Powers `/api/chat` and `/api/email` |
| `FIREBASE_SERVICE_ACCOUNT` | No | Service account JSON. Backs Firestore chat logging and cross-instance rate limiting. Without it both degrade gracefully — logging no-ops and rate limiting falls back to per-instance memory. |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS allowlist. Defaults to the Firebase, Vercel, and localhost origins. |
| `AI_DAILY_REQUEST_CAP` | No | Global ceiling on AI requests per UTC day across all callers. Defaults to `1000`. |

## Abuse Protection

The AI endpoints are public and unauthenticated, so they're guarded in [`api/guards.js`](stephen-portfolio/api/guards.js):

| Guard | Limit |
|---|---|
| Per-IP burst | 8/min chat, 4/min email |
| Per-IP daily | 60/day chat, 20/day email |
| Global daily cap | `AI_DAILY_REQUEST_CAP` (default 1000) |
| Input length | 500 chars chat, 600 chars email |
| Payload | Client-supplied projects clamped to 25 entries, 300 chars per field |
| Origin | Non-allowlisted origins get `403` |

Counters live in Firestore keyed by a **SHA-256 hash of the IP** — raw addresses are never stored — and fall back to in-memory counting if Firestore is unavailable, so an outage degrades the limiter instead of taking the chatbot down. The global cap is the guard that actually bounds worst-case spend, since per-IP limits alone don't stop someone rotating addresses.

Rate-limited requests return `429` with a `Retry-After` header and a human-readable message that the UI shows directly.

## Deployment

Both hosts deploy automatically from `main`:

| Target | Trigger | Serves |
|---|---|---|
| Firebase Hosting | [GitHub Actions](.github/workflows/firebase-hosting.yml) | Static site at the live URL |
| Vercel | Git integration | `/api/*` serverless functions |

The Firebase workflow builds `stephen-portfolio/` and deploys to the `live` channel using a `FIREBASE_DEPLOY_SERVICE_ACCOUNT` repo secret.

Note that this is a **different credential** from the `FIREBASE_SERVICE_ACCOUNT` env var above, and deliberately so:

| | `FIREBASE_DEPLOY_SERVICE_ACCOUNT` | `FIREBASE_SERVICE_ACCOUNT` |
|---|---|---|
| Stored in | GitHub Actions repo secret | Vercel env vars / `.env.local` |
| Account | `github-actions-deploy@…` | `firebase-adminsdk-fbsvc@…` |
| Scope | Hosting deploy only | Firestore read/write |

The deploy account holds `firebasehosting.admin` and `firebase.viewer` and nothing else, so a leaked CI secret can't reach Firestore.

To deploy Firebase manually:

```bash
cd stephen-portfolio
npm run build
firebase deploy --only hosting
```

## Project Structure

```
portfolio/
├── .github/workflows/     # Firebase Hosting CI
└── stephen-portfolio/
    ├── api/               # Vercel serverless functions + helpers
    ├── src/
    │   ├── components/    # Navbar, Hero, About, Projects, Skills,
    │   │                  # ProjectDiscovery, EmailDraftAssistant, Footer
    │   ├── data/          # projects.js — project showcase content
    │   ├── hooks/         # useIsMobile
    │   └── services/      # aiService.js — API fetch wrappers
    └── public/
```

See [`stephen-portfolio/README.md`](stephen-portfolio/README.md) for API route details and internals.

## License

[MIT](LICENSE)
