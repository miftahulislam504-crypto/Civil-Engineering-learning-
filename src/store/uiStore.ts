import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  theme:       'light' | 'dark'
  sidebarOpen: boolean

  toggleTheme:   () => void
  setTheme:      (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  setSidebar:    (open: boolean) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme:       'dark',
      sidebarOpen: true,

      toggleTheme:   () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme:      (theme)  => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebar:    (open)   => set({ sidebarOpen: open }),
    }),
    { name: 'enginex-ui' }
  )
)
