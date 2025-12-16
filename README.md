# Smart‑Bloom

Smart‑Bloom is a small full‑stack example project for an AI‑assisted irrigation dashboard.  
It contains a Vite + React frontend and an Express + MongoDB backend that serves page data as JSON. The backend stores page content in a single Mongo collection using a simple `page` schema (name + data JSON). Frontend pages fetch their content from the backend (e.g. `/api/dashboard`, `/api/settings`, `/api/alerts`).

---

## What this app does

- Frontend: React + TypeScript UI showing Dashboard, Reports, Schedule, Alerts, Settings pages. Pages request their content from the backend and render dynamic values.
- Backend: Express API that serves page JSON documents from MongoDB. The backend exposes:
  - `GET /api` — list available page keys (top‑level names)
  - `GET /api/:name` — returns the latest page document for `name` (the document's `data` JSON)
- Data model: a single `page` schema/document type:
  - `name` (string) — page key (e.g. `dashboard`, `settings`, `reports`, `schedule`, `alert`, `index`)
  - `data` (object) — full JSON payload used by the frontend
  - timestamps to determine the latest document for a given name

Seeding: you can seed the DB using the provided `backend/db/data.json` (or your own). No POST endpoint required — the README assumes you will seed manually.

---

## Repo layout

- `/frontend` — Vite + React frontend (pages under `src/pages`)
- `/backend` — Express backend
  - `config/mongo.js` — MongoDB connection helper
  - `models/model.js` (or `models/page.js`) — page schema (name + data)
  - `db/data.json` — example seed data (top‑level keys)
  - `routes/api.js` — API router for `GET /api` and `GET /api/:name`
  - `server.js` — application entry

---

## Requirements

- Node.js >= 18
- MongoDB (local or cloud)
- (Windows) Commands in examples assume PowerShell / cmd

---

## Environment

Create `.env` files in:

- backend/.env
  - MONGO_URI=mongodb://localhost:27017/smartbloom
  - PORT=3001
- frontend/.env
  - VITE_FRONTEND_URL=http://localhost:3001

The frontend uses `import.meta.env.VITE_FRONTEND_URL` to call the backend.

---

## Run backend (development)

1. Open a terminal in the backend folder:
   - cd c:\Users\Hp\Documents\ugo\code\Smart-Bloom\backend
2. Install dependencies:
   - npm install
   - If CORS missing: npm install cors
3. Start the server:
   - node server.js
   - or use a dev script if present (e.g. `npm run dev`)

The server will connect to MongoDB and expose `/api` endpoints. Ensure CORS is enabled if frontend is served from a different origin.

---

## Seed MongoDB (manual)

You can seed using `mongoimport` or a small script. Example using `mongoimport` (assumes `data.json` is the file with an array of page documents):

Open terminal in backend folder:
- mongoimport --uri "mongodb://localhost:27017/smartbloom" --collection pages --file db/data.json --jsonArray

Each document in `data.json` should look like:
{
  "name": "dashboard",
  "data": { /* dashboard payload */ },
  "createdAt": ISODate(...), // optional
  "updatedAt": ISODate(...)
}

The backend's `GET /api/:name` route returns the latest document for that `name` (sorted by created/updated timestamp).

---

## Run frontend

1. Open terminal in frontend:
   - cd c:\Users\Hp\Documents\ugo\code\Smart-Bloom\frontend
2. Install:
   - npm install
3. Start dev server:
   - npm run dev
4. Open http://localhost:5173 (Vite default) and navigate pages — they will call backend for data.

---

## API contract (quick)

- GET /api
  - Response: { availableKeys: ["dashboard","settings", ...] }
- GET /api/:name
  - Successful response: { key: "dashboard", data: { ... } } or plain `{ ... }` depending on implementation
  - 404: { error: "Key not found", requested: "foo", availableKeys: [...] }

Frontend expects the `data` JSON to contain the fields required by each page component (see `frontend/src/pages/*`).

---

## Notes & next steps

- The backend stores each page as a JSON blob; to update a page you can insert a new document with the same `name` (the API returns the latest by timestamp).
- Add a simple seed script if you prefer to programmatically populate MongoDB from `backend/db/data.json`.
- Consider adding a `Put`/`POST` endpoint and auth when you want to allow runtime edits from the UI.
- Ensure CORS is active on the backend so Vite frontend can call it.

---

If you want, I can:
- add a seed script `backend/scripts/seed.js` that loads `db/data.json` into Mongo, or
- add the Mongoose `Page` model and repository code now. Which do you prefer?