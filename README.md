# PulseKar

PulseKar is a full-stack realtime polling and feedback platform. Authenticated users can create polls, share public links, collect anonymous or authenticated responses, view live analytics, and publish final results.

## Tech Stack

Frontend:
- React + Vite
- React Router
- Axios
- Socket.IO Client
- Tailwind CSS

Backend:
- Node.js
- Express.js
- PostgreSQL
- Drizzle ORM
- JWT Authentication
- Socket.IO

Architecture:
- Feature-based modular monolith
- Repository pattern
- Shared common layer

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

## Local Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure backend env

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://pulsekar:pulsekar@localhost:5433/pulsekar
JWT_ACCESS_SECRET=pulsekar_local_development_access_secret_please_change
JWT_ACCESS_EXPIRES_IN=1d
```

### 4. Configure frontend env

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 5. Run migrations

```bash
cd server
pnpm db:migrate
```

### 6. Start development

```bash
pnpm dev
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/health
```

## API Overview

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

PulseKar uses a normalized PostgreSQL schema:

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

## Demo Flow

1. Register or login as a creator.
2. Create a poll with multiple single-choice questions.
3. Copy the public poll link.
4. Submit a response from another browser or incognito window.
5. Watch analytics update live.
6. Publish final results.
7. Open the same public link to view the published outcome.
