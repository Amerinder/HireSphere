import { BadgeCheck, BriefcaseBusiness, FileText, Layers3, Plus, Trash2, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { fetchJobApplications, openApplicationCv, updateApplicationStatus } from '../services/applicationService.js'
import { fetchDashboardMetrics } from '../services/dashboardService.js'
import { deleteJob, fetchRecruiterJobs } from '../services/jobService.js'

function MetricCard({ label, value, tone = 'emerald' }) {
  const toneClasses = tone === 'blue'
    ? 'from-blue-50 to-sky-50 text-blue-700 ring-blue-100'
    : tone === 'amber'
      ? 'from-amber-50 to-orange-50 text-amber-700 ring-amber-100'
      : 'from-emerald-50 to-teal-50 text-emerald-700 ring-emerald-100'

  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70">
      <div className={`grid size-11 place-items-center rounded-md bg-gradient-to-br ${toneClasses} ring-1`}>
        <BriefcaseBusiness size={20} />
      </div>
      <h2 className="mt-4 text-sm font-medium text-slate-500">{label}</h2>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
    </article>
  )
}

export function AccountPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState({})
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [jobError, setJobError] = useState(null)

  useEffect(() => {
    fetchDashboardMetrics().then(setMetrics)
  }, [])

  useEffect(() => {
    if (user?.role !== 'recruiter') {
      return
    }

    async function loadRecruiterWork() {
      try {
        const recruiterJobs = await fetchRecruiterJobs()
        const applicationGroups = await Promise.all(recruiterJobs.map((job) => fetchJobApplications(job.id)))

        setJobs(recruiterJobs)
        setApplications(applicationGroups.flat())
      } catch {
        setJobError('Unable to load recruiter dashboard.')
      }
    }

    loadRecruiterWork()
  }, [user?.role])

  const removeJob = async (job) => {
    if (!window.confirm(`Delete "${job.title}"?`)) {
      return
    }

    setJobError(null)

    try {
      await deleteJob(job.id)
      setJobs((current) => current.filter((item) => item.id !== job.id))
      setApplications((current) => current.filter((item) => item.job_id !== job.id))
      setMetrics((current) => ({
        ...current,
        jobs_count: Math.max((current.jobs_count ?? 1) - 1, 0),
        open_jobs_count: job.status === 'open' ? Math.max((current.open_jobs_count ?? 1) - 1, 0) : current.open_jobs_count,
      }))
    } catch {
      setJobError('Unable to delete this job post.')
    }
  }

  const changeApplicationStatus = async (application, status) => {
    const updated = await updateApplicationStatus(application.id, status)
    setApplications((current) => current.map((item) => item.id === updated.id ? updated : item))
  }

  if (user?.role === 'recruiter') {
    const cards = [
      ['Open jobs', metrics.open_jobs_count ?? 0, 'emerald'],
      ['Closed jobs', metrics.closed_jobs_count ?? 0, 'amber'],
      ['Applications', metrics.applications_received ?? 0, 'blue'],
      ['Shortlisted', metrics.shortlisted_count ?? 0, 'emerald'],
    ]

    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-slate-950 px-6 py-7 text-white sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_24rem)]" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-200">Recruiter workspace</p>
                <h1 className="mt-1 text-3xl font-semibold">{user?.name}</h1>
                <p className="mt-2 text-sm text-slate-300">{user?.email}</p>
              </div>
              <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50" to="/jobs/new">
                <Plus size={17} />
                Post job
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, value, tone]) => (
            <MetricCard key={label} label={label} value={value} tone={tone} />
          ))}
        </div>

        {jobError ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{jobError}</p> : null}

        <section className="mt-8 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Job posts</h2>
              <p className="mt-1 text-sm text-slate-500">Manage posted roles, deadlines, and visibility.</p>
            </div>
            <span className="w-fit rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">{jobs.length} posts</span>
          </div>
          {jobs.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">No job posts yet.</p>
          ) : (
            <div className="divide-y divide-slate-200">
              {jobs.map((job) => (
                <article key={job.id} className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/80 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                      <BriefcaseBusiness size={21} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-950">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{job.company_name} / {job.location}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{job.status}</span>
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">Last date: {job.application_deadline ?? 'No deadline'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link className="inline-flex h-10 items-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-white hover:shadow-sm" to={`/jobs/${job.id}`}>
                      View
                    </Link>
                    <button className="inline-flex size-10 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50" type="button" onClick={() => removeJob(job)} aria-label={`Delete ${job.title}`}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Student applications</h2>
              <p className="mt-1 text-sm text-slate-500">Review candidates, open CVs, and update hiring status.</p>
            </div>
            <span className="w-fit rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">{applications.length} received</span>
          </div>
          {applications.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">No applications received yet.</p>
          ) : (
            <div className="divide-y divide-slate-200">
              {applications.map((application) => (
                <article key={application.id} className="grid gap-4 p-5 transition hover:bg-slate-50/80 xl:grid-cols-[1.2fr_1fr_auto] xl:items-center">
                  <div className="flex gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700">
                      <UserRound size={21} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-950">{application.first_name} {application.last_name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{application.job?.title} / {application.student?.email}</p>
                      <p className="mt-2 text-sm text-slate-600">{application.college_name} / {application.degree} in {application.specialization} / CGPA {application.current_cgpa}</p>
                    </div>
                  </div>
                  <p className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">{application.cover_note || 'No cover note.'}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-white hover:shadow-sm" type="button" onClick={() => openApplicationCv(application)}>
                      <FileText size={16} />
                      CV
                    </button>
                    <select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" value={application.status} onChange={(event) => changeApplicationStatus(application, event.target.value)} disabled={application.status === 'withdrawn'}>
                      <option value="submitted">Submitted</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn" disabled>Withdrawn</option>
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    )
  }

  const cards = user?.role === 'student'
    ? [
        ['Applications', metrics.applications_count ?? 0, 'blue'],
        ['Saved jobs', metrics.saved_jobs_count ?? 0, 'emerald'],
        ['Shortlisted', metrics.shortlisted_count ?? 0, 'amber'],
      ]
    : [
        ['Users', metrics.users_count ?? 0, 'blue'],
        ['Recruiters', metrics.active_recruiters ?? 0, 'emerald'],
        ['Jobs', metrics.jobs_count ?? 0, 'amber'],
      ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="relative bg-slate-950 px-6 py-7 text-white sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.32),transparent_22rem)]" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-lg bg-white/12 text-white ring-1 ring-white/20">
                <UserRound size={25} />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-200">Dashboard</p>
                <h1 className="mt-1 text-3xl font-semibold">{user?.name}</h1>
                <p className="mt-2 text-sm text-slate-300">{user?.email}</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-white/15">
              <BadgeCheck size={16} />
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {user?.role === 'student' ? (
          <Link className="inline-flex h-11 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800" to="/applications">
            My applications
          </Link>
        ) : null}
        {user?.role === 'student' ? (
          <Link className="inline-flex h-11 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50" to="/saved-jobs">
            Saved jobs
          </Link>
        ) : null}
        {user?.role === 'student' ? (
          <Link className="inline-flex h-11 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50" to="/resumes">
            Resume analysis
          </Link>
        ) : null}
        {user?.role === 'admin' ? (
          <Link className="inline-flex h-11 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800" to="/admin/analytics">
            Admin analytics
          </Link>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(([label, value, tone]) => (
          <MetricCard key={label} label={label} value={value} tone={tone} />
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700">
            <Layers3 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Workspace overview</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Use the shortcuts above to manage applications, saved jobs, resume analysis, and account activity.
            </p>
          </div>
        </div>
      </section>
    </section>
  )
}
