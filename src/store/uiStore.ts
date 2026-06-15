import { create } from 'zustand'

interface UIState {
  sidebarOpen:    boolean
  theme:          'dark' | 'light'
  setSidebarOpen: (open: boolean) => void
  toggleSidebar:  () => void
  setTheme:       (theme: 'dark' | 'light') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen:    false,
  theme:          'dark',
  setSidebarOpen: (open)  => set({ sidebarOpen: open }),
  toggleSidebar:  ()      => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setTheme:       (theme) => set({ theme }),
}))
