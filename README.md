# Samarth — SIH Demo (MoSJE / NSFDC Digital Loan Platform)

Two deployable pieces:

- `backend/` → deploy to **Render** (Express API, in-memory sample data)
- `frontend/` → deploy to **Vercel** (React + Vite, points at the Render URL via `VITE_API_URL`)

## Order of operations

1. Deploy `backend/` to Render first, note its URL.
2. Deploy `frontend/` to Vercel, set `VITE_API_URL` to that Render URL.
3. Hit `<render-url>/api/health` once before recording your demo video — Render's
   free tier sleeps when idle, and the first request after sleep can take ~30s.
4. Follow the demo script in `frontend/README.md` for the walkthrough order.

See each folder's README for exact deploy steps.
