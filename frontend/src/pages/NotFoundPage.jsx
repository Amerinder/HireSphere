import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <div>
        <p className="text-sm font-semibold text-emerald-700">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Page not found</h1>
        <Link className="mt-6 inline-flex h-11 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white" to="/">
          Back to jobs
        </Link>
      </div>
    </main>
  )
}
