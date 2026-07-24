# stephen-portfolio

React + Vite frontend and serverless API for the portfolio site. See the [root README](../README.md) for the project overview, architecture, and deployment.

## Dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build locally
npm run lint     # eslint
```

## Environment variables

Create `.env.local` in this directory. These are read server-side by the API functions (`globalThis.process.env`) and are never exposed to the client — there are no `VITE_`-prefixed build-time variables in this project.

```
OPENAI_API_KEY=sk-...              # required
FIREBASE_SERVICE_ACCOUNT={"..."}   # optional — full service account JSON, single line
```

`FIREBASE_SERVICE_ACCOUNT` enables Firestore chat logging. Without it, [`chatLogger.js`](api/chatLogger.js) leaves `db` null and every log call returns early, so chat behaves normally.

## API

Two HTTP endpoints, both deployed as Vercel Serverless Functions:

| Route | Method | Purpose |
|---|---|---|
| `/api/chat` | POST | Project Discovery chatbot — streams `gpt-5.6-luna` responses |
| `/api/email` | POST | Email draft generation via `gpt-5.6-luna` |

The remaining files in [`api/`](api/) are **helper modules imported by `chat.js`**, not routes — they have no default export and will error if hit directly:

| Module | Role |
|---|---|
| [`githubFetcher.js`](api/githubFetcher.js) | Fetches live repo data to ground the chatbot's answers |
| [`linkedinProfile.js`](api/linkedinProfile.js) | Static LinkedIn profile context |
| [`handshakeProfile.js`](api/handshakeProfile.js) | Static Handshake profile context |
| [`chatLogger.js`](api/chatLogger.js) | Writes exchanges to the Firestore `chatLogs` collection |
| [`firestore.js`](api/firestore.js) | Shared Firestore handle — isolated because `db.settings()` may only be called once per instance |
| [`guards.js`](api/guards.js) | CORS allowlist, per-IP and global rate limiting, payload clamping |

### Implementation notes

- GitHub context is cached in module scope for 10 minutes (`CONTEXT_CACHE_TTL_MS`) and capped at 25 projects / 220 chars per description to bound prompt size.
- Firestore runs with `preferRest: true`. gRPC's default transport stalls on Vercel's serverless network until it times out.
- `logChatMessage` never throws, and callers `await` it so the write lands before the function freezes after responding.
- Rate limiting checks in-memory state first, so a caller already over quota on this instance is rejected without a Firestore round trip. Firestore is then authoritative across instances. Both fail open — see [Abuse Protection](../README.md#abuse-protection).
- Rate-limit documents carry an `expiresAt` field (48h out), but **no TTL policy is enabled** — the `rateLimits` collection is cleared manually by choice. It grows by one doc per unique visitor per day. Nothing breaks if it's left alone; docs are keyed by UTC day, so stale ones are never read.

## Build output

Chunking is configured in [`vite.config.js`](vite.config.js) via `manualChunks`:

- `index.js` — Navbar + Hero, the critical path, loads immediately
- `vendor-react.js` — React, ReactDOM, scheduler; cached across deploys
- `vendor-icons.js` — react-icons; cached across deploys
- Everything else — About, Projects, Skills, ProjectDiscovery, EmailDraftAssistant, Footer — is `React.lazy()`-loaded per [`App.jsx`](src/App.jsx)
