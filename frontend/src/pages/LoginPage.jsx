import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import heroImage from '../assets/images/campus-hiring-hero.png'
import { useAuth } from '../hooks/useAuth.js'
import { requestLoginOtp, verifyLoginOtp } from '../services/authService.js'

export function LoginPage() {
  const { register, handleSubmit, formState } = useForm()
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [pendingEmail, setPendingEmail] = useState('')
  const [step, setStep] = useState('email')

  const onSubmit = async (values) => {
    setError(null)
    setStatus(null)

    try {
      if (step === 'email') {
        const email = values.email.trim()
        const response = await requestLoginOtp({ email, role: values.role ?? 'student' })

        setPendingEmail(email)
        setStep('otp')
        setStatus(response.local_otp ? `Local dev OTP: ${response.local_otp}` : response.message)
        return
      }

      const response = await verifyLoginOtp({ email: pendingEmail, code: values.code })
      signIn(response.token, response.user)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Unable to continue. Please try again.')
    }
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_26rem] lg:px-8">
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm lg:block">
        <img className="h-[34rem] w-full object-cover opacity-90" src={heroImage} alt="" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid size-11 place-items-center rounded-md bg-emerald-600 text-white">
          <Mail size={20} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">LOGIN</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Enter your email to receive a six-digit OTP.</p>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-700">Email Address</span>
          <input
            type="email"
            className="mt-2 h-12 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="you@example.com"
            disabled={step === 'otp'}
            {...register('email', { required: true })}
          />
        </label>
        {step === 'email' ? (
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Account Type</span>
            <select
              className="mt-2 h-12 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              defaultValue="student"
              {...register('role')}
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>
        ) : (
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">OTP</span>
            <input
              className="mt-2 h-12 w-full rounded-md border border-slate-300 px-3 text-lg tracking-[0.35em] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              {...register('code', { required: step === 'otp' })}
            />
          </label>
        )}
        {status ? <p className="mt-4 break-words rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p> : null}
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button className="mt-5 h-12 w-full rounded-md bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800" disabled={formState.isSubmitting}>
          {step === 'email' ? 'Send OTP' : 'Verify OTP'}
        </button>
        {step === 'otp' ? (
          <button className="mt-3 h-11 w-full rounded-md border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={() => setStep('email')}>
            Use a different email
          </button>
        ) : null}
      </form>
    </section>
  )
}
