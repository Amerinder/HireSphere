# HireSphere Backend

Laravel 12 API-only backend for HireSphere.

## Local Run

```powershell
$php = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"
& $php artisan serve --host=127.0.0.1 --port=8000
```

Health check:

```text
GET http://127.0.0.1:8000/api/v1/health
```

## Production

Use `backend/.env.production.example` as the environment checklist for Render.

Required secrets:

- `APP_KEY`
- `MONGODB_URI`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`

Optional until enabled:

- Redis variables, because local/Render deployment currently uses `QUEUE_CONNECTION=sync`.
