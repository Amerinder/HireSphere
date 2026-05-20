import { BadgeCheck, BriefcaseBusiness, MapPin, Phone, Save, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchProfile, updateProfile } from '../services/profileService.js'

export function ProfilePage() {
  const { register, handleSubmit, reset, formState } = useForm()
  const [status, setStatus] = useState(null)
  const [profilePreview, setProfilePreview] = useState({})

  useEffect(() => {
    fetchProfile().then((profile) => {
      reset({ ...profile, skills: (profile.skills ?? []).join(', ') })
      setProfilePreview(profile)
    })
  }, [reset])

  const onSubmit = async (values) => {
    const updatedProfile = await updateProfile({
      ...values,
      skills: values.skills?.split(',').map((skill) => skill.trim()).filter(Boolean) ?? [],
    })
    setProfilePreview(updatedProfile)
    setStatus('Profile saved.')
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="relative bg-slate-950 px-6 py-8 text-white sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.32),transparent_22rem)]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-lg bg-white/12 text-white ring-1 ring-white/20 backdrop-blur">
                <UserRound size={30} />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-200">Account profile</p>
                <h1 className="mt-1 text-3xl font-semibold">{profilePreview.name || 'Your profile'}</h1>
                {profilePreview.headline ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">{profilePreview.headline}</p> : null}
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-white/15">
              <BadgeCheck size={16} />
              Verified email
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-0 lg:grid-cols-[18rem_1fr]">
          <aside className="border-b border-slate-200 bg-slate-50/80 p-6 lg:border-b-0 lg:border-r">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid size-12 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                <BriefcaseBusiness size={22} />
              </div>
              <h2 className="mt-4 font-semibold text-slate-950">{profilePreview.name || 'Profile owner'}</h2>
              <p className="mt-1 text-sm text-slate-500">{profilePreview.headline || 'Add a headline'}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <MapPin size={15} className="text-slate-400" />
                  {profilePreview.location || 'Add location'}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={15} className="text-slate-400" />
                  Contact visible after update
                </p>
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">Use official details that match your applications and resume.</p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Full name</span>
                <input className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" placeholder="Name" {...register('name', { required: true })} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Headline</span>
                <input className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" placeholder="Frontend developer, MBA student..." {...register('headline')} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Location</span>
                <input className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" placeholder="City, Country" {...register('location')} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Phone</span>
                <input className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" placeholder="+91..." {...register('phone')} />
              </label>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-slate-950">Professional profile</h2>
              <p className="mt-1 text-sm text-slate-500">Add the skills and summary recruiters should see first.</p>
              <label className="mt-5 block">
                <span className="text-sm font-medium text-slate-700">Skills</span>
                <input className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" placeholder="React, Laravel, MongoDB" {...register('skills')} />
              </label>
              <label className="mt-5 block">
                <span className="text-sm font-medium text-slate-700">Bio</span>
                <textarea className="mt-2 min-h-36 w-full rounded-md border border-slate-300 bg-white p-3 leading-6 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" placeholder="Write a short professional summary." {...register('bio')} />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {status ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{status}</p> : <p className="text-sm text-slate-500">Changes are saved to your account profile.</p>}
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70" disabled={formState.isSubmitting}>
                <Save size={16} />
                Save profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
