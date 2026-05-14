import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { requestMagicLink } from '../services/authService.js'

export function LoginPage() {
  const { register, handleSubmit, formState } = useForm()
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  const onSubmit = async (values) => {
    setError(null)
    setStatus(null)

    try {
      const response = await requestMagicLink({ ...values, role: values.role ?? 'student' })
      setStatus(response.magic_link_url ? `Local dev link: ${response.magic_link_url}` : response.message)
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Unable to send magic link. Please try again.')
    }
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-md place-items-center px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid size-11 place-items-center rounded-md bg-emerald-600 text-white">
          <Mail size={20} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Passwordless login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Enter your email to receive a secure magic link.</p>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-700">Email address</span>
          <input
            type="email"
            className="mt-2 h-12 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="you@example.com"
            {...register('email', { required: true })}
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Account type</span>
          <select
            className="mt-2 h-12 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            defaultValue="student"
            {...register('role')}
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </label>
        {status ? <p className="mt-4 break-words rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p> : null}
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button className="mt-5 h-12 w-full rounded-md bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800" disabled={formState.isSubmitting}>
          Send magic link
        </button>
      </form>
    </section>
  )
}
