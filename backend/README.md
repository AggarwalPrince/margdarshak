# Margdarshak — MoSJE / NSFDC Demo Backend

Express API with in-memory sample data — no real database, no Bhashini/decision-tree
API calls. Built purely for the SIH demo video.

## Deploy on Render

1. Push this `backend/` folder to a GitHub repo (or the repo root if it's the only service).
2. On Render: **New → Web Service** → connect the repo.
3. Settings:
   - **Root Directory:** `backend` (if part of a monorepo)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free is fine for a demo
4. Once deployed, note the URL, e.g. `https://mosje-demo-backend.onrender.com`.
5. Render free tier spins down when idle — hit `/api/health` a minute before recording
   your demo so the first request in the video isn't slow.

## Local run

```bash
cd backend
npm install
npm start
# -> http://localhost:4000
```

## Notes for the demo video

- OTP is hardcoded to `123456` for any 10-digit mobile number — no SMS gateway needed.
- All scheme/partner/application data resets when the server restarts (in-memory only).
- Admin actions use a plain `actor` string in the request body instead of real auth —
  enough to demonstrate maker-checker (two different actor names) without building
  full RBAC.
