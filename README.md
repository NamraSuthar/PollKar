# PulseKar

PulseKar is a full‑stack realtime polling and feedback platform. Creators can build single‑choice polls, share public links, collect anonymous or authenticated responses, and view live analytics that update in realtime.

## Tech Stack

Frontend
- React + Vite
- React Router
- Axios
- Socket.IO client
- Tailwind CSS

Backend
- Node.js + Express
- PostgreSQL
- Drizzle ORM
- JWT auth
- Socket.IO server

Architecture
- Feature-based modular monolith
- Repository + service layers
- Shared `common` components and utilities

## Features

- User registration and login
- JWT protected creator dashboard
- Poll creation with multiple questions
- Single-option questions
- Mandatory and optional question validation
- Anonymous and authenticated response modes
- Poll expiry support
- Public poll response links
- Duplicate anonymous response prevention through session token
- Creator analytics dashboard
- Question-wise option counts and percentages
- Realtime response updates with Socket.IO
- Publish final results publicly

## Quick start (local)

Requirements
- Node.js 18+ and pnpm
- Docker (optional, for local Postgres)

1) Install dependencies

```bash
pnpm install
```

2) Start a local Postgres (optional but recommended)

```bash
docker compose up -d
```

3) Create env files

- `server/.env` (example)

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://user:pass@localhost:5432/pulsekar
JWT_ACCESS_SECRET=change_this_secret
```

- `frontend/.env` (example)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4) Apply DB migrations

The SQL migrations are in `server/db/migrations/`. Apply them to your Postgres instance (your preferred migration tool or psql). Example (psql):

```bash
# adjust connection string as needed
psql "postgresql://user:pass@localhost:5432/pulsekar" -f server/db/migrations/0000_shocking_colonel_america.sql
```

5) Start development servers

From the repository root (monorepo):

```bash
pnpm dev
```

Or run services individually:

```bash
pnpm --filter frontend dev    # frontend on http://localhost:5173
pnpm --filter server dev      # backend on http://localhost:5000
```

Health check: `http://localhost:5000/health`

## API overview

Auth:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Polls:

```txt
POST   /api/polls
GET    /api/polls
GET    /api/polls/:id
PATCH  /api/polls/:id
DELETE /api/polls/:id
PATCH  /api/polls/:id/publish-results
GET    /api/polls/public/:slug
```

Responses:

```txt
POST /api/responses/polls/:slug
```

Analytics:

```txt
GET /api/analytics/polls/:pollId
GET /api/analytics/public/:slug
```

## Realtime Events

Client emits:

```txt
poll:join
poll:leave
```

Server emits:

```txt
poll:response-created
```

Rooms:

```txt
poll:<pollId>
```

## Database Design

PollKar uses a normalized PostgreSQL schema:

```txt
users -> polls -> questions -> options
polls -> responses -> answers
```

Key design decisions:
- Polls use readable slugs for public sharing.
- Questions and options use soft deletes to preserve analytics history.
- Responses store optional authenticated user IDs or anonymous session tokens.
- Answers reference the selected option for each question.
- Polls cache `response_count` for fast realtime dashboard updates.

## Demo flow

1. Register or log in as a creator
2. Create a poll with single-choice questions
3. Copy the public poll URL and open in another browser/incognito
4. Submit one or more responses
5. Watch the creator dashboard update in realtime
6. Publish final results and verify via the public link

## Common routes (frontend)

- Creator dashboard: `/dashboard/polls`
- Analytics list: `/dashboard/analytics`
- Poll analytics detail: `/dashboard/analytics/:pollId`
- Public poll: `/poll/:slug`

## Troubleshooting

- If you see an error like `relation "users" does not exist` when the server starts, the database schema likely hasn't been applied. Run the migrations in `server/db/migrations/` against your Postgres instance.
- If the frontend cannot reach the API, verify `frontend/.env` `VITE_API_URL` matches the running backend and CORS is allowed.

## Contributing

- Use the existing `common` components and `modules/*` structure for features.
- Run linting and formatting before creating PRs; file a short description and screenshots for UI changes.

---

If you'd like, I can also add a `server/.env.example` and a short migration command snippet (drizzle-kit) — want that? 
