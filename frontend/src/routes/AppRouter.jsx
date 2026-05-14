import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import { DashboardLayout } from '../layouts/DashboardLayout.jsx'
import { AccountPage } from '../pages/AccountPage.jsx'
import { AdminAnalyticsPage } from '../pages/AdminAnalyticsPage.jsx'
import { ApplicationsPage } from '../pages/ApplicationsPage.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { JobDetailPage } from '../pages/JobDetailPage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'
import { PostJobPage } from '../pages/PostJobPage.jsx'
import { ProfilePage } from '../pages/ProfilePage.jsx'
import { ResumeAnalysisPage } from '../pages/ResumeAnalysisPage.jsx'
import { SavedJobsPage } from '../pages/SavedJobsPage.jsx'
import { VerifyMagicLinkPage } from '../pages/VerifyMagicLinkPage.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'

export function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/verify" element={<VerifyMagicLinkPage />} />
            <Route element={<ProtectedRoute roles={['student', 'recruiter', 'admin']} />}>
              <Route path="/dashboard" element={<AccountPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route element={<ProtectedRoute roles={['student']} />}>
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/resumes" element={<ResumeAnalysisPage />} />
              <Route path="/saved-jobs" element={<SavedJobsPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={['recruiter', 'admin']} />}>
              <Route path="/jobs/new" element={<PostJobPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
