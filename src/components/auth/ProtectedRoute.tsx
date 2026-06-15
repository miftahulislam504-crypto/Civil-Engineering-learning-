import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import PageLoader from '@/components/common/PageLoader'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { isLoading } = useAuth()
  const user          = useAuthStore((s) => s.user)
  const location      = useLocation()

  if (isLoading) return <PageLoader />

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
