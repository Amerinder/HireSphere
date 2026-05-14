import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { fetchJobs } from '../services/jobService.js'

const stats = [
  { label: 'Open roles', value: '2,480' },
  { label: 'AI resume scans', value: '18k' },
  { label: 'Verified recruiters', value: '740' },
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
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-12">
      <div className="flex flex-col justify-center">
        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
          <Sparkles size={16} />
          Resume intelligence built into hiring
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
          HireSphere
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          A production-ready job portal SaaS foundation for student applications, recruiter pipelines, admin analytics, and AI-backed candidate scoring.
        </p>
        <div className="mt-8 grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[1fr_auto]">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-md border border-slate-200 px-3">
            <Search size={18} className="text-slate-400" />
            <input
              className="w-full border-0 bg-transparent text-sm outline-none"
              placeholder="Search jobs, skills, or companies"
              value={filters.q}
              onChange={(event) => updateFilter('q', event.target.value)}
            />
          </label>
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800" type="button">
            <SlidersHorizontal size={17} />
            Search jobs
          </button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" value={filters.workplace_type} onChange={(event) => updateFilter('workplace_type', event.target.value)}>
            <option value="">Any workplace</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" value={filters.experience_level} onChange={(event) => updateFilter('experience_level', event.target.value)}>
            <option value="">Any level</option>
            <option value="entry">Entry</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
          <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
            <option value="latest">Latest</option>
            <option value="salary_high">Highest salary</option>
            <option value="salary_low">Lowest salary</option>
          </select>
        </div>
        <dl className="mt-8 grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <dt className="text-sm text-slate-500">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-950">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">Loading jobs...</div>
        ) : null}
        {!loading && jobs.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">No open jobs yet. Recruiters can post the first role from the dashboard.</div>
        ) : null}
        {jobs.map((job) => (
          <article key={job.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {job.company_name} / {job.location}
                </p>
              </div>
              <Link className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white" to={`/jobs/${job.id}`}>
                View
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(job.skills ?? []).map((skill) => (
                <span key={skill} className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
