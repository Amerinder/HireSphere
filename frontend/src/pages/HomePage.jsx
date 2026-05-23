import { BriefcaseBusiness, CalendarDays, MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/images/campus-hiring-hero.png'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { fetchJobs } from '../services/jobService.js'

const stats = [
  { label: 'Open roles', value: '2,480' },
  { label: 'Resume scans', value: '11k' },
  { label: 'Recruiters', value: '740' },
]

export function HomePage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ q: '', workplace_type: '', experience_level: '', sort: 'latest' })
  const debouncedQuery = useDebouncedValue(filters.q)
  const { workplace_type, experience_level, sort } = filters

  useEffect(() => {
    let active = true

    fetchJobs({ q: debouncedQuery, workplace_type, experience_level, sort })
      .then((response) => {
        if (active) {
          setJobs(response.data)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [debouncedQuery, workplace_type, experience_level, sort])

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <img className="absolute inset-0 h-full w-full object-cover" src={heroImage} alt="" />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl content-end gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl pb-4">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur">
              <Sparkles size={16} />
              Campus hiring, resumes, and recruiter JobPostings in one place
            </div>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-6xl">HireSphere</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-100">
              Discover student-ready roles, apply with a complete profile, and help recruiters review candidates with cleaner workflows.
            </p>
          </div>
          <div className="rounded-lg bg-white/18 p-3 shadow-2xl shadow-slate-950/20 ring-1 ring-white/35 backdrop-blur-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
              <label className="flex min-h-12 items-center gap-3 rounded-md border border-white/35 bg-white/20 px-3 text-white backdrop-blur-sm">
                <Search size={18} className="text-white/80" />
                <input
                  className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-white/80"
                  placeholder="Search jobs, skills, or companies"
                  value={filters.q}
                  onChange={(event) => updateFilter('q', event.target.value)}
                />
              </label>
              <select className="h-12 rounded-md border border-white/35 bg-white/20 px-3 text-sm text-white backdrop-blur-sm" value={filters.workplace_type} onChange={(event) => updateFilter('workplace_type', event.target.value)}>
                <option value="">Any workplace</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <select className="h-12 rounded-md border border-white/35 bg-white/20 px-3 text-sm text-white backdrop-blur-sm" value={filters.experience_level} onChange={(event) => updateFilter('experience_level', event.target.value)}>
                <option value="">Any level</option>
                <option value="entry">Entry</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700" type="button">
                <SlidersHorizontal size={17} />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-950">Sort listings</h2>
              <select className="mt-3 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
                <option value="latest">Latest first</option>
                <option value="salary_high">Highest salary</option>
                <option value="salary_low">Lowest salary</option>
              </select>
            </div>
            <dl className="grid gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <dt className="text-sm text-slate-500">{stat.label}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-slate-950">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Latest Opportunities</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Open Jobs</h2>
              </div>
              <p className="text-sm text-slate-500">{loading ? 'Refreshing listings...' : `${jobs.length} roles shown`}</p>
            </div>
            <div className="mt-5 grid gap-4">
              {loading ? (
                <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Loading jobs...</div>
              ) : null}
              {!loading && jobs.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">No open jobs yet. Recruiters can post the first role from the dashboard.</div>
              ) : null}
              {jobs.map((job) => (
                <article key={job.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="grid size-12 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                        <BriefcaseBusiness size={21} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">{job.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{job.company_name}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{job.location}</span>
                          {job.application_deadline ? <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} />Apply by {job.application_deadline}</span> : null}
                        </div>
                      </div>
                    </div>
                    <Link className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800" to={`/jobs/${job.id}`}>
                      View role
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-700">{job.workplace_type}</span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-700">{job.experience_level}</span>
                    {(job.skills ?? []).slice(0, 5).map((skill) => (
                      <span key={skill} className="rounded-md bg-emerald-50 px-2.5 py-1 text-sm text-emerald-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
