# HireSphere

HireSphere is a full-stack job portal for students, recruiters, and admins. It uses a Laravel API, MongoDB persistence, Sanctum bearer authentication, email OTP login, a React/Vite frontend, recruiter job management, student applications with CV upload, and optional AI resume analysis.

## Features

- Email OTP login with student/recruiter role selection
- MongoDB-backed users, jobs, applications, saved jobs, resumes, and OTPs
- Student job search, saved jobs, applications, CV upload, and application withdrawal
- Recruiter job posting, job deletion, application deadlines, applicant review, CV preview, and status updates
- Automatic closure behavior for jobs after the last application date
- Profile management for students and recruiters
- Dashboard metrics for students, recruiters, and admins
- Resume upload, PDF parsing, AI/fallback resume analysis, and candidate ranking
- Admin analytics, user listing, job moderation, and recruiter verification APIs
- Responsive React UI with Tailwind CSS and Lucide icons
- Render/Vercel deployment artifacts

## Tech Stack

Backend:

- Laravel 12
- MongoDB Laravel driver
- Laravel Sanctum
- Laravel Mail / SMTP / optional Resend transport
- PDF parser for resume extraction
- OpenAI service with local deterministic fallback

Frontend:

- React
- Vite
- React Router
- Axios
- React Hook Form
- Tailwind CSS
- Lucide React icons

## Project Structure

```text
backend/
  app/Http/Controllers/API
  app/Http/Requests
  app/Http/Resources
  app/Models
  app/Repositories
  app/Services
  routes/api.php

frontend/
  src/api
  src/context
  src/hooks
  src/layouts
  src/pages
  src/routes
  src/services
  src/assets
```

## Local Setup

Backend:

```powershell
cd backend
copy .env.example .env
php artisan key:generate
php artisan serve
```

Frontend:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

MongoDB:

- Local URI: `mongodb://127.0.0.1:27017`
- Database: `hiresphere`
- Main collections: `users`, `jobs`, `applications`, `saved_jobs`, `resumes`, `login_otps`, `companies`, `personal_access_tokens`

## Environment Notes

Backend `.env` defaults:

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
DB_CONNECTION=mongodb
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DATABASE=hiresphere
MAIL_MAILER=log
QUEUE_CONNECTION=sync
LOGIN_OTP_EXPIRE_MINUTES=10
```

For Gmail OTP delivery:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SCHEME=smtp
MAIL_USERNAME=yourgmail@gmail.com
MAIL_PASSWORD=your_google_app_password_without_spaces
MAIL_FROM_ADDRESS=yourgmail@gmail.com
MAIL_FROM_NAME="HireSphere"
```

Google shows app passwords with spaces. Put the password in `.env` without spaces.

After changing mail config:

```powershell
cd backend
php artisan config:clear
```

Local development with `MAIL_MAILER=log` returns `local_otp` so login can be tested without real email.

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

## Auth API

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

Verify OTP:

```http
POST http://localhost:8000/api/v1/auth/otp/verify
Accept: application/json
Content-Type: application/json

{
  "email": "student@gmail.com",
  "code": "123456"
}
```

Get current user:

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

## Jobs API

Search jobs:

```http
GET http://localhost:8000/api/v1/jobs?q=Laravel&workplace_type=remote&experience_level=junior&sort=latest
Accept: application/json
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
  "application_deadline": "2026-06-30",
  "status": "open"
}
```

Delete a job as recruiter/admin:

```http
DELETE http://localhost:8000/api/v1/jobs/{job_id}
Accept: application/json
Authorization: Bearer RECRUITER_TOKEN
```

Open jobs with a past `application_deadline` are not shown in public open listings and do not accept new applications.

## Applications API

Apply to a job as student:

```http
POST http://localhost:8000/api/v1/jobs/{job_id}/applications
Accept: application/json
Authorization: Bearer STUDENT_TOKEN
Content-Type: multipart/form-data

first_name=Asha
last_name=Sharma
college_name=Delhi Technical Campus
current_cgpa=8.4
degree=B.Tech
specialization=Computer Science
cover_note=I have built Laravel APIs and React dashboards.
cv=@resume.pdf
```

List my applications:

```http
GET http://localhost:8000/api/v1/applications/me
Accept: application/json
Authorization: Bearer STUDENT_TOKEN
```

Withdraw an application:

```http
DELETE http://localhost:8000/api/v1/applications/{application_id}
Accept: application/json
Authorization: Bearer STUDENT_TOKEN
```

Review applicants as recruiter:

```http
GET http://localhost:8000/api/v1/jobs/{job_id}/applications
Accept: application/json
Authorization: Bearer RECRUITER_TOKEN
```

Preview an application CV in the browser:

```http
GET http://localhost:8000/api/v1/applications/{application_id}/cv
Accept: application/pdf
Authorization: Bearer RECRUITER_TOKEN
```

Update application status:

```http
PATCH http://localhost:8000/api/v1/applications/{application_id}/status
Accept: application/json
Authorization: Bearer RECRUITER_TOKEN
Content-Type: application/json

{
  "status": "shortlisted"
}
```

Supported recruiter statuses: `submitted`, `shortlisted`, `rejected`.

## Profile API

```http
PUT http://localhost:8000/api/v1/profile
Accept: application/json
Authorization: Bearer YOUR_SANCTUM_TOKEN
Content-Type: application/json

{
  "name": "Asha Student",
  "headline": "React and Laravel learner",
  "location": "Remote",
  "phone": "+91 9999999999",
  "skills": ["React", "Laravel", "MongoDB"],
  "bio": "Student developer interested in full-stack web apps."
}
```

## Saved Jobs API

Save a job:

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

Unsave a job:

```http
DELETE http://localhost:8000/api/v1/jobs/{job_id}/save
Accept: application/json
Authorization: Bearer STUDENT_TOKEN
```

## Resume And AI APIs

Upload a resume:

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

Rank candidates for a job:

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

If `OPENAI_API_KEY` is empty, local development uses a deterministic fallback analyzer.

## Dashboard And Admin APIs

Dashboard metrics:

```http
GET http://localhost:8000/api/v1/dashboard
Accept: application/json
Authorization: Bearer YOUR_SANCTUM_TOKEN
```

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

Verify a recruiter:

```http
PATCH http://localhost:8000/api/v1/admin/recruiters/{recruiter_id}/verify
Accept: application/json
Authorization: Bearer ADMIN_TOKEN
```

## Verification

Backend:

```powershell
cd backend
php artisan test
```

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

## Deployment

Backend deployment artifacts:

- `render.yaml`
- `backend/Dockerfile`
- `backend/docker/render-start.sh`
- `backend/.env.production.example`

Frontend deployment artifacts:

- `frontend/vercel.json`
- `frontend/.env.production.example`

Render backend essentials:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-render-api.onrender.com
FRONTEND_URL=https://your-vercel-app.vercel.app
DB_CONNECTION=mongodb
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=hiresphere
QUEUE_CONNECTION=sync
CACHE_STORE=file
SESSION_DRIVER=file
MAIL_MAILER=smtp
OPENAI_API_KEY=your_openai_key
```

Vercel frontend variable:

```env
VITE_API_BASE_URL=https://your-render-api.onrender.com/api/v1
```

Production checklist:

- Use MongoDB Atlas.
- Configure SMTP, Gmail app password, or Resend before expecting OTP emails.
- Keep `OPENAI_API_KEY` only on the backend host.
- Set `APP_URL` and `FRONTEND_URL` to the exact production URLs.
- Keep bearer tokens client-side only and do not log them.
- Re-enable Redis workers later if async queues are needed.
