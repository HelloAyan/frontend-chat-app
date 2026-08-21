# Threadly — Real-time Chat App

A real-time one-to-one and group messaging app built on the provided chat API, plus a landing page showcasing it.

## Live Demo

Both parts are the same Next.js deployment — the landing page is `/`, the chat app is behind `/login` and `/chat`.

- Part 1 (chat app): https://frontend-chat-app-ruby.vercel.app/login
- Part 2 (landing page): https://frontend-chat-app-ruby.vercel.app/

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Redux Toolkit / RTK Query** — data fetching, caching, tag-based invalidation, and cursor-based infinite pagination for message history
- **Socket.IO client** — real-time message and conversation updates
- **Tailwind CSS 4** — styling, driven by a small `oklch` design-token layer in `src/app/globals.css`
- **date-fns** — timestamp/date-divider formatting
- **react-hot-toast** — toast notifications
- **lucide-react** — icons
- **swagger-ui-dist** — renders the hand-written OpenAPI spec at `/api-docs`

## Getting Started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # fill in the two API URLs (defaults already point at the provided backend)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page is at `/`, login at `/login`, the chat app at `/chat` (redirects to `/login` if there's no session), and the API docs at `/api-docs`.

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | REST API base URL |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL (host root, mounted separately from the REST API) |

Both are consumed client-side (RTK Query base query + the socket connection), so they need to be set in the hosting platform's environment settings too, not just locally.

## API Documentation

Written by hand as an OpenAPI 3 spec at [`docs/openapi.yaml`](docs/openapi.yaml), rendered through Swagger UI at `/api-docs` (served via `/api/openapi.yaml`). Endpoint names/shapes were kept close to the given API, with a few additions (documented inline in the spec) where the frontend needed something the raw API didn't cleanly expose.

---

## Part 3 — Thought Process Write-up

### Architecture & approach (Part 1)

The app is organized by feature rather than by file type: `src/features/{auth,conversations,groups,messages,users}` each own their RTK Query slice (`api.js`) and any related hooks, separate from the `src/components/chat` presentational components. This keeps each domain's data logic easy to find and change independently as the API surface grows.

**RTK Query** was the main data-layer decision. It gives caching, tag-based invalidation, and built-in loading/error states out of the box, which map directly onto the assignment's "loading, empty, and error states" requirement instead of hand-rolling that per screen. Its `infiniteQuery` builder handles the cursor-based `before` pagination for message history cleanly. The trade-off is weight — a plain `fetch` + `useState`, or a lighter library like SWR, would have been enough for a smaller app — but it paid off once the socket layer needed to patch the same cache that RTK Query owns (see below), and once five different entities (users, conversations, groups, messages, auth) needed to stay consistent with each other.

All REST calls go through one small wrapper, `src/lib/api-client.js` (`apiFetch`), which owns the base URL, the auth header, and — importantly — normalizes the API's error responses, which aren't always shaped consistently (see "Issues" below). `rtkBaseQuery` adapts that wrapper to RTK Query's `baseQuery` contract, so every feature slice reuses the same adapter instead of each one reaching for `fetchBaseQuery` and re-solving the same error-shape problem.

**Real-time** updates use `socket.io-client` directly rather than a queue/polling fallback, since the brief calls for messages to "appear automatically." A `useChatSocket` hook (`features/messages/hooks.js`) is wired into `chat/page.js` and patches the RTK Query cache directly on incoming `message`/`conversation` events instead of refetching, so a new message shows up without a network round-trip.

**Auth** is a cookie-based session, gated by Next.js middleware (`src/proxy.js`) that redirects unauthenticated visitors away from protected routes. The middleware only checks that the cookie *exists* — it can't verify the JWT's signature without the backend's signing secret, so real validation happens client-side via an `/auth/me` call on mount, which clears the cookie and bounces the user if the token turns out to be dead. This is a deliberate trade-off: instant redirect on the common case, with the client as the source of truth for anything the middleware can't check.

**Auto-scroll** (`MessageList.js`) is hand-rolled rather than pulled from a library: a ref tracks whether the user is currently "pinned" to the bottom (within a small threshold), new messages scroll into view only while pinned, and scrolling up shows a "new messages" pill instead of yanking the view back down — matching the brief's requirement exactly rather than approximating it with an off-the-shelf autoscroll hook.

### Design choices (Part 2)

The landing page deliberately reuses the real product's visual primitives — the chat-bubble color tokens, the `Avatar` component, the same panel layout — inside its mockups (`ChatPreview`, `RealtimeShowcase`, `ConversationCard`) instead of generic stock screenshots. The goal was to show the actual feature, not an approximation of it, so a visitor's mental model of "what does this look like" matches the real `/chat` screen exactly.

`RealtimeShowcase` runs a short scripted sequence on mount — base messages, a typing indicator, then a message "arriving" with its own entrance animation — to *demonstrate* the real-time pitch rather than just claim it in copy. It respects `prefers-reduced-motion` and skips straight to the end state for anyone with that preference set.

All landing copy and mock data live in `src/lib/landingContent.js` as typed config objects, consumed entirely through props — no section component hardcodes its own text. That was a conscious choice so the page can be re-worded or restructured without touching component logic, and so every section (Hero, chat preview, conversation types, real-time showcase, features, CTA, navbar, footer) stays a pure function of its input data.

Every section also runs a brief simulated-loading skeleton before rendering, even though the content is static mock data — this was for visual consistency with the real chat panel's own loading states, so the page doesn't feel like it's cutting a corner the actual app doesn't.

The navbar and footer, and the closing CTA section, deliberately reuse the same background glow and button styling as the Hero, so the page opens and closes with the same visual signature instead of introducing a new style at the edges.

### AI tool usage

I used **Claude Code** (Claude Sonnet 5) throughout this project — for scaffolding components and RTK Query slices, generating realistic mock data for the landing page, drafting the initial structure of the OpenAPI documentation, and debugging. One concrete example: the hero image on the landing page was intermittently failing to load, which I traced (with Claude Code's help) to the auth middleware's matcher not excluding `/images/*`, so unauthenticated visitors' image requests were being redirected to `/login`.

I directed the overall structure, feature scope, and UI decisions, and reviewed every change before accepting it — e.g. I had it remove a loading skeleton from the navbar after seeing it in practice felt unnecessary, fix an anchor-link mismatch between two landing sections, and move hardcoded API URLs into environment variables. Where its first pass didn't fit — like an early phone-input library that added formatting characters the API's exact-match search couldn't handle — I rejected it and had it replaced with a plain digit-only input instead (see "Issues" below).

### What I'd improve with more time

- Automated tests — unit tests for the RTK Query slices and the `MessageList` scroll logic, an end-to-end test for login → search → send → real-time receive.
- Optimistic UI for sent messages instead of waiting on the mutation response.
- Message delivery/read receipts, and a real typing indicator wired to the socket (currently only simulated on the landing page).
- Virtualizing the message list for very long conversation histories instead of rendering every loaded message.
- An accessibility pass — focus management in the group dialogs, `aria-live` announcements for incoming messages.
- File/image attachments.
- Migrating to TypeScript, mainly to get compile-time guarantees against the API's inconsistent response shapes instead of catching them at runtime.

### Issues I ran into with the API

- **`GET /users/search` 500s on a leading `+`.** Searching by a properly formatted phone number (e.g. `+8801...`) crashes the endpoint with `"quantifier does not follow a repeatable item"` — the backend is evidently building a regex straight from the raw query string, and `+` is being interpreted as a regex quantifier with nothing before it. Worked around by stripping regex metacharacters from the search query before sending it, client-side.
- **Phone number matching is exact and unnormalized.** Login and search both match the phone number verbatim, with no formatting/whitespace normalization server-side. I initially used a phone-input library that auto-formatted the number with spaces and a country-code prefix, which caused a real "user not found" bug — the formatted string no longer matched what was stored. Fixed by using a plain digits-only input instead of fighting the library.
- **Inconsistent error envelope.** Most failures return `{ error: { message, code } }`, but some paths — e.g. sending a message to an unrecognized `conversationId` — return a bare `200` with a `null` body instead of an error status. `apiFetch` treats a failed/`null` JSON parse defensively rather than assuming every response has an `error` object, and `chat/page.js` treats a `null` result from `sendMessage` as a failure even though the HTTP status was 200.
- **`POST /conversations` (starting a 1:1) returns a slim shape.** Unlike the full `Conversation` object other endpoints return, this one comes back as just `{ _id, participants, createdAt }` — no `lastMessage`/`updatedAt`. The frontend refetches the conversation list afterward rather than trusting the mutation's own response to be complete.
