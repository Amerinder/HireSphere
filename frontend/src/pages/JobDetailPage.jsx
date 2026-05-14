import { Bookmark, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { applyToJob } from '../services/applicationService.js'
import { saveJob } from '../services/dashboardService.js'
import { fetchJob } from '../services/jobService.js'

export function JobDetailPage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const { register, handleSubmit, formState } = useForm()
  const [job, setJob] = useState(null)
  const [status, setStatus] = useState(null)
  const [saveStatus, setSaveStatus] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchJob(id).then(setJob)
  }, [id])

  const onSubmit = async (values) => {
    setError(null)
    setStatus(null)

    try {
      await applyToJob(id, values)
      setStatus('Application submitted.')
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Unable to apply.')
    }
  }

  const onSave = async () => {
    setSaveStatus(null)

    try {
      await saveJob(id)
      setSaveStatus('Saved.')
    } catch (requestError) {
      setSaveStatus(requestError.response?.data?.message ?? 'Unable to save.')
    }
  }

  if (!job) {
    return <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500">Loading job...</div>
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_24rem] lg:px-8">
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-emerald-700">{job.company_name}</p>
        <h1 className="mt-2 text-3xl font-semibold">{job.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{job.location} · {job.workplace_type} · {job.employment_type}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(job.skills ?? []).map((skill) => (
            <span key={skill} className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-700">{skill}</span>
          ))}
        </div>
        <p className="mt-6 whitespace-pre-line leading-7 text-slate-700">{job.description}</p>
      </article>
      <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Apply</h2>
        {!isAuthenticated ? (
          <Link className="mt-4 inline-flex h-11 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white" to="/login">
            Login to apply
          </Link>
        ) : user?.role !== 'student' ? (
          <p className="mt-4 text-sm text-slate-500">Only student accounts can apply to jobs.</p>
        ) : (
          <>
            <button className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 text-sm font-semibold" onClick={onSave} type="button">
              <Bookmark size={16} />
              Save job
            </button>
            {saveStatus ? <p className="mt-3 rounded-md bg-slate-100 p-3 text-sm text-slate-700">{saveStatus}</p> : null}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <textarea className="min-h-32 w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600" placeholder="Short cover note" {...register('cover_note')} />
              {status ? <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{status}</p> : null}
              {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
              <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 text-sm font-semibold text-white" disabled={formState.isSubmitting}>
                <Send size={16} />
                Submit application
              </button>
            </form>
          </>
        )}
      </aside>
    </section>
  )
}
