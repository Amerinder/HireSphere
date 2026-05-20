import { BriefcaseBusiness } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const navItems = [
  { to: '/', label: 'Jobs' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
]

export function DashboardLayout() {
  const { isAuthenticated, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-9 place-items-center rounded-md bg-slate-950 text-white shadow-sm">
              <BriefcaseBusiness size={19} />
            </span>
            <span>HireSphere</span>
          </NavLink>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button onClick={signOut} className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800">
                Logout
              </button>
            ) : (
              <NavLink to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800">
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>AI-powered recruitment workflows for students and recruiters.</span>
          <span>Built for focused campus hiring workflows.</span>
        </div>
      </footer>
    </div>
  )
}
