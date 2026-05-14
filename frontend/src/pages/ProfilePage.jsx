import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchProfile, updateProfile } from '../services/profileService.js'

export function ProfilePage() {
  const { register, handleSubmit, reset, formState } = useForm()
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetchProfile().then((profile) => {
      reset({ ...profile, skills: (profile.skills ?? []).join(', ') })
    })
  }, [reset])

  const onSubmit = async (values) => {
    await updateProfile({
      ...values,
      skills: values.skills?.split(',').map((skill) => skill.trim()).filter(Boolean) ?? [],
    })
    setStatus('Profile saved.')
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input className="h-11 rounded-md border border-slate-300 px-3" placeholder="Name" {...register('name', { required: true })} />
          <input className="h-11 rounded-md border border-slate-300 px-3" placeholder="Headline" {...register('headline')} />
          <input className="h-11 rounded-md border border-slate-300 px-3" placeholder="Location" {...register('location')} />
          <input className="h-11 rounded-md border border-slate-300 px-3" placeholder="Phone" {...register('phone')} />
        </div>
        <input className="mt-4 h-11 w-full rounded-md border border-slate-300 px-3" placeholder="Skills, comma separated" {...register('skills')} />
        <textarea className="mt-4 min-h-32 w-full rounded-md border border-slate-300 p-3" placeholder="Bio" {...register('bio')} />
        {status ? <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{status}</p> : null}
        <button className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white" disabled={formState.isSubmitting}>
          <Save size={16} />
          Save profile
        </button>
      </form>
    </section>
  )
}
