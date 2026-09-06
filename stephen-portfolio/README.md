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
UPSTASH_REDIS_REST_URL=https://... # optional
UPSTASH_REDIS_REST_TOKEN=...       # optional
```

The Upstash pair enables chat logging and cross-instance rate limiting. Without both, [`upstash.js`](api/upstash.js) reports `redisAvailable === false`: every log call returns early and rate limiting falls back to per-instance memory, so chat behaves normally.

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
| [`linkedinProfile.js`](api/linkedinProfile.js) | Static LinkedIn profile context — the single source of truth for profile facts |
| [`handshakeProfile.js`](api/handshakeProfile.js) | **Parked.** No longer imported; kept so it can be switched back on |
| [`chatLogger.js`](api/chatLogger.js) | Appends exchanges to the Redis `chatLogs` list, `LTRIM`-capped at 500 |
| [`upstash.js`](api/upstash.js) | Dependency-free Upstash Redis REST client (pipeline + fire-and-forget) |
| [`guards.js`](api/guards.js) | CORS allowlist, per-IP and global rate limiting, payload clamping |

### Implementation notes

- GitHub context is cached in module scope for 10 minutes (`CONTEXT_CACHE_TTL_MS`) and capped at 25 projects / 220 chars per description to bound prompt size.
- Upstash replaced `firebase-admin`, whose transitive gRPC/protobuf tree cost ~19MB on every cold start just to back a rate limiter. Upstash speaks plain HTTP, so `fetch` is the whole client.
- Upstash calls carry a 2s timeout. Without a ceiling, one stalled call would hold the chat response open behind the rate-limit check.
- `logChatMessage` never throws, and callers `await` it so the write lands before the function freezes after responding.
- Rate limiting checks in-memory state first, so a caller already over quota on this instance is rejected without a network round trip. Redis is then authoritative across instances. Both fail open — see [Abuse Protection](../README.md#abuse-protection).
- Rate-limit keys are `INCR`-based with a TTL (burst keys expire with the window, daily keys at UTC midnight), so a pipeline replaces the old read-modify-write transaction and expiry needs no manual cleanup.

## Build output

Chunking is configured in [`vite.config.js`](vite.config.js) via `manualChunks`:

- `index.js` — Navbar + Hero, the critical path, loads immediately
- `vendor-react.js` — React, ReactDOM, scheduler; cached across deploys
- `vendor-icons.js` — react-icons; cached across deploys
- Everything else — About, Experience, Projects, Skills, Credentials, ProjectDiscovery, EmailDraftAssistant, Footer — is `React.lazy()`-loaded per [`App.jsx`](src/App.jsx)
- `ProjectDemoModal` is lazy-loaded a second level down, from [`Projects.jsx`](src/components/Projects.jsx), and pulls `MonicaAiDemo` in with it — so the demo bundle only downloads when a visitor actually opens a demo
