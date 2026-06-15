import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils'

export default function MainLayout() {
  // Initialize auth listener
  useAuth()

  const { theme, sidebarOpen } = useUIStore()
  const user = useAuthStore((s) => s.user)

  // Apply dark/light class to <html>
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className={cn('min-h-screen', theme === 'dark' ? 'dark' : '')}>
      <Navbar />

      <div className="flex">
        {/* Sidebar (only for logged-in users) */}
        {user && <Sidebar />}

        {/* Main content */}
        <main
          className={cn(
            'flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300',
            user && sidebarOpen  && 'ml-60',
            user && !sidebarOpen && 'ml-16',
          )}
        >
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
