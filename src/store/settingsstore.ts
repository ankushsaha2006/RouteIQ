import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  autoOptimize: boolean;
  notifyOnNewRequest: boolean;
  notifyOnDelay: boolean;
  maintenanceThresholdKm: number;
  currency: string;
  updateSettings: (settings: Partial<Omit<SettingsState, 'updateSettings'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      autoOptimize: true,
      notifyOnNewRequest: true,
      notifyOnDelay: true,
      maintenanceThresholdKm: 10000,
      currency: 'INR',
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings }))
    }),
    {
      name: 'settings-storage'
    }
  )
);
