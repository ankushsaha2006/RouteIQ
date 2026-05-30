// src/store/fleetStore.ts
import { create } from 'zustand';
import { Vehicle, Driver, Assignment, Request } from '../types';
import { mockVehicles } from '../data/mockVehicles';
import { mockDrivers } from '../data/mockDrivers';
import { mockAssignments } from '../data/mockAssignments';
import { mockRequests } from '../data/mockRequests';

interface FleetState {
  vehicles: Vehicle[];
  drivers: Driver[];
  assignments: Assignment[];
  requests: Request[];
  fetchVehicles: () => Promise<void>;
  fetchDrivers: () => Promise<void>;
  fetchAssignments: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateVehicleStatus: (id: string, status: Vehicle['status']) => void;
  updateDriverStatus: (id: string, status: Driver['status']) => void;
}

const createFleetStore = (set: any): FleetState => ({
  vehicles: [],
  drivers: [],
  assignments: [],
  requests: [],
  fetchVehicles: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ vehicles: mockVehicles });
  },
  fetchDrivers: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ drivers: mockDrivers });
  },
  fetchAssignments: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ assignments: mockAssignments });
  },
  fetchRequests: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ requests: mockRequests });
  },
  addVehicle: (vehicle) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: 'v' + Math.random().toString(36).substr(2, 9),
      lastUpdate: new Date().toISOString()
    };
    set((state: FleetState) => ({ vehicles: [...state.vehicles, newVehicle] }));
  },
  addDriver: (driver) => {
    const newDriver: Driver = {
      ...driver,
      id: 'd' + Math.random().toString(36).substr(2, 9),
      earnings: 0,
      rating: 0
    };
    set((state: FleetState) => ({ drivers: [...state.drivers, newDriver] }));
  },
  updateVehicleStatus: (id, status) => {
    set((state: FleetState) => ({
      vehicles: state.vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, status, lastUpdate: new Date().toISOString() } : vehicle
      )
    }));
  },
  updateDriverStatus: (id, status) => {
    set((state: FleetState) => ({
      drivers: state.drivers.map((driver) =>
        driver.id === id ? { ...driver, status } : driver
      )
    }));
  }
});

export const useFleetStore = create<FleetState>(createFleetStore);
