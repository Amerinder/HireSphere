import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyApplications, openApplicationCv, withdrawApplication } from '../services/applicationService.js'

export function ApplicationsPage() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    fetchMyApplications().then(setApplications)
  }, [])

  const withdraw = async (application) => {
    if (!window.confirm(`Withdraw your application for ${application.job?.title}?`)) {
      return
    }

    const updated = await withdrawApplication(application.id)
    setApplications((current) => current.map((item) => item.id === updated.id ? updated : item))
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Applications</h1>
      <div className="mt-5 space-y-3">
        {applications.length === 0 ? <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">No applications yet.</p> : null}
        {applications.map((application) => (
          <article key={application.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-semibold">{application.job?.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{application.job?.company_name} / {application.status}</p>
                <p className="mt-2 text-sm text-slate-600">{application.degree} in {application.specialization} / CGPA {application.current_cgpa}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link className="inline-flex h-10 items-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700" to={`/jobs/${application.job_id}`}>
                  View job
                </Link>
                <button className="inline-flex h-10 items-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700" type="button" onClick={() => openApplicationCv(application)}>
                  CV
                </button>
                {application.status !== 'withdrawn' ? (
                  <button className="inline-flex h-10 items-center rounded-md border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50" type="button" onClick={() => withdraw(application)}>
                    Withdraw
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
