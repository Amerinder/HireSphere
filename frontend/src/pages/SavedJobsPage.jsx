import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSavedJobs, unsaveJob } from '../services/dashboardService.js'

export function SavedJobsPage() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetchSavedJobs().then(setJobs)
  }, [])

  const removeSavedJob = async (jobId) => {
    await unsaveJob(jobId)
    setJobs((current) => current.filter((job) => job.id !== jobId))
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Saved jobs</h1>
      <div className="mt-5 space-y-3">
        {jobs.length === 0 ? <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">No saved jobs yet.</p> : null}
        {jobs.map((job) => (
          <article key={job.id} className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">{job.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{job.company_name} / {job.location}</p>
            </div>
            <div className="flex gap-2">
              <Link className="inline-flex h-10 items-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white" to={`/jobs/${job.id}`}>View</Link>
              <button className="inline-flex h-10 items-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700" onClick={() => removeSavedJob(job.id)} type="button">
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
