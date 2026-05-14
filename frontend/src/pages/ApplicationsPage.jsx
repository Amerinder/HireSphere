import { useEffect, useState } from 'react'
import { fetchMyApplications } from '../services/applicationService.js'

export function ApplicationsPage() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    fetchMyApplications().then(setApplications)
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Applications</h1>
      <div className="mt-5 space-y-3">
        {applications.length === 0 ? <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">No applications yet.</p> : null}
        {applications.map((application) => (
          <article key={application.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{application.job?.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{application.job?.company_name} · {application.status}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
