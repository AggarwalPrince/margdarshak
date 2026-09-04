# Samarth — MoSJE Demo Frontend

React + Vite single-page app covering the full beneficiary journey (language →
OTP login → voice input → scheme matcher → EMI calculator → nearby partners →
document upload → confirmation) plus an NSFDC admin panel (scheme CRUD,
publish/deprecate, maker-checker approval, audit log).

All data comes from the `backend/` API with sample data — no real Bhashini,
decision-tree, or payment integrations.

## Deploy on Vercel

1. Push `frontend/` to a GitHub repo (or as a subfolder of a monorepo).
2. On Vercel: **Add New → Project** → import the repo.
3. Settings:
   - **Root Directory:** `frontend` (if part of a monorepo)
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add an environment variable:
   - `VITE_API_URL` = your deployed Render backend URL (e.g. `https://mosje-demo-backend.onrender.com`) — **no trailing slash**.
5. Deploy. If you add/change `VITE_API_URL` later, trigger a redeploy — Vite bakes env vars in at build time.

## Local run

```bash
cd frontend
npm install
npm run dev
# -> http://localhost:5173
# Make sure the backend is running locally on :4000, or set VITE_API_URL in a .env file
```

## Demo script (for the video)

1. **Landing → Get started → pick a language** — show the language tiles switching UI text.
2. **Login** — enter any 10-digit number, OTP is always `123456`.
3. **Voice input** — tap the mic (Chrome desktop/Android) and speak a project description, or type it. Mention this stands in for the Bhashini pipeline in production.
4. **Scheme matcher** — fill income/project cost/type, show 2–3 schemes returned and ranked by interest rate.
5. **Calculator** — drag the sliders, show EMI recalculating live, point out the frozen-version note.
6. **Partners** — allow location (or let it fall back to Jaipur), show distance-sorted list, tap "Directions" to show the Google Maps handoff, mention no map tiles were loaded.
7. **Upload + submit** — attach any files, submit, show the tracking ID screen.
8. **Admin panel** — log out, click "NSFDC Admin", log in as `admin_ravi`, edit a **published** scheme's interest rate → show it goes to "Pending approvals" instead of applying instantly. Log out, log in as `admin_priya`, approve it — show the version number bump and the audit log entry. This is your maker-checker + versioning story, which is the strongest governance point for judges.

## Known limits (say this proactively if asked)

- Sample/in-memory data only — resets when the backend restarts.
- Voice-to-text uses the browser's native Web Speech API, not Bhashini.
- Admin auth is two hardcoded demo accounts, not real RBAC.
- File uploads are simulated (filenames only, nothing is stored).
