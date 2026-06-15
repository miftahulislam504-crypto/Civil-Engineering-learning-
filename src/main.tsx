import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Layouts
import MainLayout  from '@/components/layout/MainLayout'
import AuthLayout  from '@/components/layout/AuthLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages
import HomePage          from '@/pages/home/HomePage'
import LoginPage         from '@/pages/auth/LoginPage'
import RegisterPage      from '@/pages/auth/RegisterPage'
import ResetPage         from '@/pages/auth/ResetPage'
import DashboardPage     from '@/pages/dashboard/DashboardPage'
import CoursesPage       from '@/pages/courses/CoursesPage'
import CourseDetailPage  from '@/pages/courses/CourseDetailPage'
import CourseLearnPage   from '@/pages/courses/CourseLearnPage'
import EncyclopediaPage  from '@/pages/encyclopedia/EncyclopediaPage'
import TopicPage         from '@/pages/encyclopedia/TopicPage'
import LibraryPage       from '@/pages/library/LibraryPage'
import AIPage            from '@/pages/ai/AIPage'
import QuizPage          from '@/pages/quiz/QuizPage'
import QuizPlayerPage    from '@/pages/quiz/QuizPlayerPage'
import ProfilePage       from '@/pages/profile/ProfilePage'
import CertificatesPage  from '@/pages/certificates/CertificatesPage'
import CareerPage        from '@/pages/career/CareerPage'
import DesignLabPage     from '@/pages/design-lab/DesignLabPage'
import ResearchPage      from '@/pages/research/ResearchPage'
import SoftwarePage      from '@/pages/software/SoftwarePage'
import ConstructionPage  from '@/pages/construction/ConstructionPage'

import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public layout */}
          <Route element={<MainLayout />}>
            <Route path="/"            element={<HomePage />} />
            <Route path="/encyclopedia"        element={<EncyclopediaPage />} />
            <Route path="/encyclopedia/:slug"  element={<TopicPage />} />
            <Route path="/courses"             element={<CoursesPage />} />
            <Route path="/courses/:id"         element={<CourseDetailPage />} />
            <Route path="/library"             element={<LibraryPage />} />
            <Route path="/career"              element={<CareerPage />} />
            <Route path="/software"            element={<SoftwarePage />} />
            <Route path="/construction"        element={<ConstructionPage />} />
            <Route path="/research"            element={<ResearchPage />} />

            {/* Protected routes */}
            <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/courses/:id/learn" element={<ProtectedRoute><CourseLearnPage /></ProtectedRoute>} />
            <Route path="/ai"           element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
            <Route path="/quiz"         element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/quiz/:id"     element={<ProtectedRoute><QuizPlayerPage /></ProtectedRoute>} />
            <Route path="/design-lab"   element={<ProtectedRoute><DesignLabPage /></ProtectedRoute>} />
            <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
          </Route>

          {/* Auth layout */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login"    element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/reset"    element={<ResetPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
