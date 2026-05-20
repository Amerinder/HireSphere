# HireSphere

HireSphere is a full-stack AI-powered job portal SaaS platform with a Laravel 12 API backend, MongoDB persistence, React/Vite frontend, email OTP authentication, Redis queues, email delivery, and OpenAI-powered resume intelligence.

## Phase Status

Completed:

- Laravel 12 backend scaffolded in `backend`
- React/Vite frontend scaffolded in `frontend`
- MongoDB Laravel driver installed and configured
- Sanctum, Redis client, Resend SDK, and PDF parser packages installed for later phases
- Tailwind CSS, React Router, Axios, React Hook Form, and Lucide icons installed
- API route baseline added at `/api/v1/health`
- Scalable frontend and backend folders created
- Passwordless email OTP auth implemented with expiring single-use codes
- Sanctum bearer tokens stored in MongoDB
- Student and recruiter self-selection added to login
- Role middleware added for protected APIs
- Frontend auth context, protected routes, dashboard shell, and logout added
- User profile API and frontend profile form added
- Recruiter job posting and job CRUD APIs added
- Student applications and recruiter applicant review APIs added
- Frontend job list, job detail/apply, post-job, and applications pages added
- MongoDB-backed job search filters, sorting, and pagination added
- Student saved jobs added
- Student, recruiter, and admin dashboard metrics added
- Frontend debounced search, saved jobs page, and live dashboard metrics added
- Phase 5 Redis queue worker infrastructure is intentionally deferred by request
- Phase 6 resume upload, PDF parsing, AI analysis, and candidate ranking APIs added
- Admin analytics API and dashboard added
- Admin user listing, job moderation, and recruiter verification endpoints added
- Security headers added to API responses

## Structure

```text
backend/
  app/Http/Controllers/API
  app/Http/Requests
  app/Http/Resources
  app/Models
  app/Services
  app/Repositories
  app/Jobs
  app/Notifications
  app/Policies
  app/Actions
  app/Traits
  routes/api.php

frontend/
  src/api
  src/components
  src/pages
  src/layouts
  src/hooks
  src/services
  src/routes
  src/utils
  src/context
```

## Packages Installed

Backend:

- `mongodb/laravel-mongodb`: official MongoDB integration for Laravel Eloquent and query builder.
- `laravel/sanctum`: API token authentication for the email OTP login flow.
- `predis/predis`: Redis client for queue workers without requiring the PhpRedis extension.
- `resend/resend-php`: optional Resend mail transport for OTP and notification emails.
- `smalot/pdfparser`: extracts text from uploaded resume PDFs before AI scoring.

Frontend:

- `axios`: API client foundation.
- `react-router-dom`: route management and protected route setup.
- `react-hook-form`: accessible, scalable form state.
- `lucide-react`: consistent icon system.
- `clsx`: conditional class composition.
- `tailwindcss` and `@tailwindcss/vite`: utility-first styling via the Vite plugin.

## Local Setup

Backend:

```powershell
cd backend
copy .env.example .env
php artisan serve
```

Frontend:

```powershell
cd frontend
copy .env.example .env
npm run dev
```

MongoDB Compass:

- Use `mongodb://127.0.0.1:27017`
- Database name: `hiresphere`
- Collections planned: `users`, `companies`, `jobs`, `applications`, `saved_jobs`, `notifications`, `login_otps`, `analytics`, `resumes`

## API Smoke Test

```http
GET http://localhost:8000/api/v1/health
Accept: application/json
```

Expected response:

```json
{
  "name": "HireSphere",
  "status": "ok",
  "environment": "local",
  "database": "mongodb"
}
```

## Auth API Examples

Request an OTP:

```http
POST http://localhost:8000/api/v1/auth/otp
Accept: application/json
Content-Type: application/json

{
  "email": "student@gmail.com",
  "role": "student"
}
```

Verify the OTP:

```http
POST http://localhost:8000/api/v1/auth/otp/verify
Accept: application/json
Content-Type: application/json

{
  "email": "student@gmail.com",
  "code": "123456"
}
```

Local development uses `MAIL_MAILER=log` by default and also returns `local_otp` from the request endpoint, so OTP login works without a real email account. To send through Gmail SMTP, set `MAIL_MAILER=smtp`, `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=587`, `MAIL_USERNAME` to your Gmail address, and `MAIL_PASSWORD` to a Google app password.

Get the current user:

```http
GET http://localhost:8000/api/v1/auth/me
Accept: application/json
Authorization: Bearer YOUR_SANCTUM_TOKEN
```

Logout:

```http
POST http://localhost:8000/api/v1/auth/logout
Accept: application/json
Authorization: Bearer YOUR_SANCTUM_TOKEN
```

## Phase 3 API Examples

Update profile:

```http
PUT http://localhost:8000/api/v1/profile
Accept: application/json
Authorization: Bearer YOUR_SANCTUM_TOKEN
Content-Type: application/json

{
  "name": "Asha Student",
  "headline": "React and Laravel learner",
  "location": "Remote",
  "skills": ["React", "Laravel", "MongoDB"]
}
```

Post a job as recruiter:

```http
POST http://localhost:8000/api/v1/jobs
Accept: application/json
Authorization: Bearer RECRUITER_TOKEN
Content-Type: application/json

{
  "company_name": "OrbitHire",
  "title": "Laravel MongoDB Developer",
  "description": "Build clean recruitment workflows.",
  "location": "Remote",
  "workplace_type": "remote",
  "employment_type": "full_time",
  "experience_level": "junior",
  "salary_min": 60000,
  "salary_max": 90000,
  "currency": "USD",
  "skills": ["Laravel", "MongoDB", "React"],
  "status": "open"
}
```

Apply to a job as student:

```http
POST http://localhost:8000/api/v1/jobs/{job_id}/applications
Accept: application/json
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "cover_note": "I have built Laravel APIs and React dashboards."
}
```

Review applicants as recruiter:

```http
GET http://localhost:8000/api/v1/jobs/{job_id}/applications
Accept: application/json
Authorization: Bearer RECRUITER_TOKEN
```

Shortlist or reject an application:

```http
PATCH http://localhost:8000/api/v1/applications/{application_id}/status
Accept: application/json
Authorization: Bearer RECRUITER_TOKEN
Content-Type: application/json

{
  "status": "shortlisted"
}
```

## Phase 4 API Examples

Search jobs:

```http
GET http://localhost:8000/api/v1/jobs?q=Laravel&workplace_type=remote&experience_level=junior&sort=latest
Accept: application/json
```

Save a job as student:

```http
POST http://localhost:8000/api/v1/jobs/{job_id}/save
Accept: application/json
Authorization: Bearer STUDENT_TOKEN
```

List saved jobs:

```http
GET http://localhost:8000/api/v1/saved-jobs
Accept: application/json
Authorization: Bearer STUDENT_TOKEN
```

Dashboard metrics:

```http
GET http://localhost:8000/api/v1/dashboard
Accept: application/json
Authorization: Bearer YOUR_SANCTUM_TOKEN
```

## Phase 7 API Examples

Admin analytics:

```http
GET http://localhost:8000/api/v1/admin/analytics
Accept: application/json
Authorization: Bearer ADMIN_TOKEN
```

Admin user listing:

```http
GET http://localhost:8000/api/v1/admin/users?role=recruiter
Accept: application/json
Authorization: Bearer ADMIN_TOKEN
```

Close a moderated job:

```http
PATCH http://localhost:8000/api/v1/admin/jobs/{job_id}/close
Accept: application/json
Authorization: Bearer ADMIN_TOKEN
```

Verify a recruiter company:

```http
PATCH http://localhost:8000/api/v1/admin/recruiters/{recruiter_id}/verify
Accept: application/json
Authorization: Bearer ADMIN_TOKEN
```

## Phase 6 API Examples

Upload a resume as student:

```http
POST http://localhost:8000/api/v1/resumes
Accept: application/json
Authorization: Bearer STUDENT_TOKEN
Content-Type: multipart/form-data

resume=@resume.pdf
```

Analyze a resume:

```http
POST http://localhost:8000/api/v1/resumes/{resume_id}/analyze
Accept: application/json
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "job_id": "optional_job_id"
}
```

Rank candidates for a job as recruiter/admin:

```http
GET http://localhost:8000/api/v1/jobs/{job_id}/candidate-ranking
Accept: application/json
Authorization: Bearer RECRUITER_OR_ADMIN_TOKEN
```

OpenAI configuration:

```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-5.4-mini
```

If `OPENAI_API_KEY` is empty, local development uses a deterministic fallback analyzer. The queue job still runs through Laravel's job class, but `QUEUE_CONNECTION=sync` is used because Phase 5 Redis workers are deferred.

## Final Phase Status

Phase 8 deployment preparation is included below. Deferred Phase 5 Redis worker infrastructure can be resumed later without changing the public API shape.

## Phase 8 Deployment

Added deployment artifacts:

- `render.yaml` for the Render backend service
- `backend/Dockerfile` for a PHP 8.3 Laravel API container
- `backend/docker/render-start.sh` for Render startup optimization and serving
- `backend/.env.production.example` for Render production variables
- `frontend/vercel.json` for Vercel SPA rewrites
- `frontend/.env.production.example` for Vercel production variables
- Backend and frontend README files

Backend deployment on Render:

1. Push the repository to GitHub.
2. In Render, create a Blueprint from `render.yaml`, or create a Docker web service manually with `backend` as the root directory.
3. Set these required environment variables:

```env
APP_URL=https://your-render-api.onrender.com
FRONTEND_URL=https://your-vercel-app.vercel.app
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=hiresphere
RESEND_API_KEY=your_resend_key
OPENAI_API_KEY=your_openai_key
```

4. Keep these production values:

```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mongodb
QUEUE_CONNECTION=sync
CACHE_STORE=file
SESSION_DRIVER=file
```

Frontend deployment on Vercel:

1. Import the GitHub repository in Vercel.
2. Set the project root directory to `frontend`.
3. Use the default Vite build command:

```text
npm run build
```

4. Set the output directory:

```text
dist
```

5. Add:

```env
VITE_API_BASE_URL=https://your-render-api.onrender.com/api/v1
```

Production checklist:

- Use MongoDB Atlas instead of local MongoDB.
- Verify your SMTP, Gmail app password, or Resend sender/domain before expecting real OTP emails.
- Add `OPENAI_API_KEY` only in Render, never in frontend or committed files.
- Set `FRONTEND_URL` to the exact Vercel production URL.
- Set `APP_URL` to the exact Render production URL.
- Keep bearer tokens client-side only; never print them in logs.
- Re-enable Redis and queue workers later if Phase 5 is restored.

## Phase 8 Readiness

Verified before Phase 8:

- `composer validate --no-check-publish` passes
- Laravel API route registration passes with 31 API routes
- Laravel test suite passes
- Frontend `npm run lint` passes
- Frontend `npm run build` passes
- End-to-end smoke test passes for OTP auth, job posting, applications, saved jobs, resume analysis fallback, candidate ranking, admin analytics, and security headers

Deferred or environment-dependent:

- Redis queue workers are deferred; local queue driver is `sync`
- OpenAI calls require `OPENAI_API_KEY`; local fallback analysis is active without a key
- Production email delivery requires working SMTP credentials or `RESEND_API_KEY` with a verified sender/domain
- Production deployment needs Render/Vercel environment variables configured in Phase 8
