import { BadgeCheck, BriefcaseBusiness, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { fetchDashboardMetrics } from '../services/dashboardService.js'

export function AccountPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState({})

  useEffect(() => {
    fetchDashboardMetrics().then(setMetrics)
  }, [])

  const cards = user?.role === 'student'
    ? [
        ['Applications', metrics.applications_count ?? 0],
        ['Saved jobs', metrics.saved_jobs_count ?? 0],
        ['Shortlisted', metrics.shortlisted_count ?? 0],
      ]
    : user?.role === 'recruiter'
      ? [
          ['Total jobs', metrics.jobs_count ?? 0],
          ['Open jobs', metrics.open_jobs_count ?? 0],
          ['Applications', metrics.applications_received ?? 0],
        ]
      : [
          ['Users', metrics.users_count ?? 0],
          ['Recruiters', metrics.active_recruiters ?? 0],
          ['Jobs', metrics.jobs_count ?? 0],
        ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-md bg-emerald-600 text-white">
              <UserRound size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{user?.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
            <BadgeCheck size={16} />
            {user?.role}
          </span>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {user?.role === 'recruiter' || user?.role === 'admin' ? (
          <Link className="inline-flex h-11 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white" to="/jobs/new">
            Post job
          </Link>
        ) : null}
        {user?.role === 'student' ? (
          <Link className="inline-flex h-11 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white" to="/applications">
            My applications
          </Link>
        ) : null}
        {user?.role === 'student' ? (
          <Link className="inline-flex h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700" to="/saved-jobs">
            Saved jobs
          </Link>
        ) : null}
        {user?.role === 'student' ? (
          <Link className="inline-flex h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700" to="/resumes">
            Resume analysis
          </Link>
        ) : null}
        {user?.role === 'admin' ? (
          <Link className="inline-flex h-11 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white" to="/admin/analytics">
            Admin analytics
          </Link>
        ) : null}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <BriefcaseBusiness size={20} className="text-slate-500" />
            <h2 className="mt-3 text-sm font-medium text-slate-500">{label}</h2>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
