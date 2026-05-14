import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createJob } from '../services/jobService.js'

export function PostJobPage() {
  const { register, handleSubmit, reset, formState } = useForm({ defaultValues: { workplace_type: 'remote', employment_type: 'internship', experience_level: 'entry', status: 'open', currency: 'USD' } })
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  const onSubmit = async (values) => {
    setStatus(null)
    setError(null)

    try {
      await createJob({
        ...values,
        salary_min: values.salary_min ? Number(values.salary_min) : null,
        salary_max: values.salary_max ? Number(values.salary_max) : null,
        skills: values.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      })
      reset()
      setStatus('Job posted successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Unable to post job.')
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Post a job</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input className="h-11 rounded-md border border-slate-300 px-3" placeholder="Company name" {...register('company_name', { required: true })} />
          <input className="h-11 rounded-md border border-slate-300 px-3" placeholder="Job title" {...register('title', { required: true })} />
          <input className="h-11 rounded-md border border-slate-300 px-3" placeholder="Location" {...register('location', { required: true })} />
          <input className="h-11 rounded-md border border-slate-300 px-3" placeholder="Skills, comma separated" {...register('skills', { required: true })} />
          <select className="h-11 rounded-md border border-slate-300 px-3" {...register('workplace_type')}><option value="remote">Remote</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option></select>
          <select className="h-11 rounded-md border border-slate-300 px-3" {...register('employment_type')}><option value="internship">Internship</option><option value="full_time">Full time</option><option value="part_time">Part time</option><option value="contract">Contract</option></select>
          <select className="h-11 rounded-md border border-slate-300 px-3" {...register('experience_level')}><option value="entry">Entry</option><option value="junior">Junior</option><option value="mid">Mid</option><option value="senior">Senior</option></select>
          <select className="h-11 rounded-md border border-slate-300 px-3" {...register('status')}><option value="open">Open</option><option value="draft">Draft</option></select>
          <input className="h-11 rounded-md border border-slate-300 px-3" type="number" placeholder="Salary min" {...register('salary_min')} />
          <input className="h-11 rounded-md border border-slate-300 px-3" type="number" placeholder="Salary max" {...register('salary_max')} />
        </div>
        <textarea className="mt-4 min-h-40 w-full rounded-md border border-slate-300 p-3" placeholder="Job description" {...register('description', { required: true })} />
        {status ? <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white" disabled={formState.isSubmitting}>
          <Plus size={16} />
          Publish job
        </button>
      </form>
    </section>
  )
}
