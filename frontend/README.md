# HireSphere Frontend

React/Vite frontend for HireSphere.

## Local Run

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

## Production

Use `frontend/.env.production.example` for Vercel.

Required variable:

```env
VITE_API_BASE_URL=https://your-render-api.onrender.com/api/v1
```

`vercel.json` includes an SPA rewrite so direct links like `/dashboard` and `/admin/analytics` load correctly.
