import { Activity, BriefcaseBusiness, ShieldCheck, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchAdminAnalytics } from '../services/adminService.js'

const iconMap = {
  users: UsersRound,
  jobs: BriefcaseBusiness,
  applications: Activity,
  open_jobs: ShieldCheck,
}

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchAdminAnalytics().then(setAnalytics)
  }, [])

  if (!analytics) {
    return <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500">Loading analytics...</div>
  }

  const primaryCards = ['users', 'recruiters', 'jobs', 'applications']

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Platform totals, moderation signal, and recent activity.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primaryCards.map((key) => {
          const Icon = iconMap[key] ?? Activity

          return (
            <article key={key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon size={20} className="text-slate-500" />
              <h2 className="mt-3 text-sm font-medium capitalize text-slate-500">{key.replace('_', ' ')}</h2>
              <p className="mt-2 text-3xl font-semibold">{analytics.totals[key] ?? 0}</p>
            </article>
          )
        })}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Application status</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(analytics.applications_by_status).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
                <span className="capitalize">{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Recent jobs</h2>
          <div className="mt-4 space-y-3">
            {analytics.recent.jobs.map((job) => (
              <div key={job.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm">
                <p className="font-medium">{job.title}</p>
                <p className="mt-1 text-slate-500">{job.company_name} / {job.status}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
