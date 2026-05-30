// src/store/uiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notificationsPanelOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleNotificationsPanel: () => void;
  closeNotificationsPanel: () => void;
}

const createUIStore = (set: any): UIState => ({
  theme: 'light',
  sidebarOpen: false,
  commandPaletteOpen: false,
  notificationsPanelOpen: false,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state: UIState) => ({ sidebarOpen: !state.sidebarOpen })),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleNotificationsPanel: () =>
    set((state: UIState) => ({ notificationsPanelOpen: !state.notificationsPanelOpen })),
  closeNotificationsPanel: () => set({ notificationsPanelOpen: false })
});

export const useUIStore = create<UIState>()(
  persist(createUIStore, {
    name: 'ui-storage'
  })
);
