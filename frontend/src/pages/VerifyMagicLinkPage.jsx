import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { verifyMagicLink } from '../services/authService.js'

const verificationRequests = new Map()

function getVerificationRequest(email, token) {
  const key = `${email}:${token}`

  if (!verificationRequests.has(key)) {
    verificationRequests.set(key, verifyMagicLink({ email, token }))
  }

  return verificationRequests.get(key)
}

export function VerifyMagicLinkPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [state, setState] = useState({ status: 'loading', message: 'Verifying your secure link...' })

  useEffect(() => {
    let active = true

    async function verify() {
      const email = searchParams.get('email')
      const token = searchParams.get('token')

      if (!email || !token) {
        setState({ status: 'error', message: 'This sign-in link is missing required information.' })
        return
      }

      try {
        const response = await getVerificationRequest(email, token)

        if (!active) {
          return
        }

        signIn(response.token, response.user)
        setState({ status: 'success', message: 'You are signed in.' })
        setTimeout(() => navigate('/dashboard', { replace: true }), 700)
      } catch (error) {
        if (active) {
          setState({ status: 'error', message: error.response?.data?.message ?? 'This sign-in link is invalid or expired.' })
        }
      }
    }

    verify()

    return () => {
      active = false
    }
  }, [navigate, searchParams, signIn])

  const Icon = state.status === 'loading' ? Loader2 : state.status === 'success' ? CheckCircle2 : XCircle

  return (
    <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-md place-items-center px-4 py-10">
      <div className="w-full rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <Icon className={`mx-auto ${state.status === 'loading' ? 'animate-spin text-slate-500' : state.status === 'success' ? 'text-emerald-600' : 'text-red-600'}`} size={34} />
        <h1 className="mt-4 text-2xl font-semibold">Magic link</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{state.message}</p>
        {state.status === 'error' ? (
          <Link className="mt-5 inline-flex h-11 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white" to="/login">
            Request a new link
          </Link>
        ) : null}
      </div>
    </section>
  )
}
