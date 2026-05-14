import { FileText, Sparkles, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchJobs } from '../services/jobService.js'
import { analyzeResume, fetchResumes, uploadResume } from '../services/resumeService.js'

export function ResumeAnalysisPage() {
  const [resumes, setResumes] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchResumes().then(setResumes)
    fetchJobs().then((response) => setJobs(response.data))
  }, [])

  const onUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setBusy(true)
    setError(null)

    try {
      const resume = await uploadResume(file)
      setResumes((current) => [resume, ...current])
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Unable to upload resume.')
    } finally {
      setBusy(false)
    }
  }

  const runAnalysis = async (resumeId) => {
    setBusy(true)
    setError(null)

    try {
      const resume = await analyzeResume(resumeId, selectedJob ? { job_id: selectedJob } : {})
      setResumes((current) => current.map((item) => (item.id === resume.id ? resume : item)))
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Unable to analyze resume.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI resume analysis</h1>
          <p className="mt-1 text-sm text-slate-500">Upload a PDF, extract skills, score fit, and get profile suggestions.</p>
        </div>
        <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white">
          <Upload size={16} />
          Upload PDF
          <input className="hidden" type="file" accept="application/pdf" onChange={onUpload} />
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <select className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" value={selectedJob} onChange={(event) => setSelectedJob(event.target.value)}>
          <option value="">General resume analysis</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title} / {job.company_name}</option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-6 space-y-4">
        {resumes.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">No resumes uploaded yet.</p>
        ) : null}
        {resumes.map((resume) => (
          <article key={resume.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="grid size-11 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="font-semibold">{resume.original_name}</h2>
                  <p className="mt-1 text-sm text-slate-500">Status: {resume.status}</p>
                </div>
              </div>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white disabled:opacity-60" disabled={busy} onClick={() => runAnalysis(resume.id)} type="button">
                <Sparkles size={16} />
                Analyze
              </button>
            </div>
            {resume.analysis ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-[12rem_1fr]">
                <div className="rounded-md bg-emerald-50 p-4 text-center">
                  <p className="text-sm font-medium text-emerald-700">Match score</p>
                  <p className="mt-2 text-4xl font-semibold text-emerald-800">{resume.analysis.match_score}%</p>
                  <p className="mt-2 text-xs text-emerald-700">{resume.analysis.provider}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoList title="Skills" items={resume.analysis.skills} />
                  <InfoList title="Missing skills" items={resume.analysis.missing_skills} />
                  <InfoList title="Strengths" items={resume.analysis.strengths} />
                  <InfoList title="Suggestions" items={resume.analysis.profile_suggestions} />
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function InfoList({ title, items = [] }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">
        {items.length === 0 ? <li>None</li> : null}
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}
