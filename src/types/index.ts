// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'driver' | 'admin';
  avatar?: string;
}

export interface Vehicle {
  id: string;
  number: string;
  type: string;
  capacity: number;
  status: 'active' | 'idle' | 'maintenance';
  driverId?: string;
  location?: { lat: number; lng: number };
  lastUpdate: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  status: 'online' | 'offline' | 'busy';
  rating: number;
  vehicleId?: string;
  earnings: number;
}

export interface Assignment {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  vehicleId: string;
  driverId: string;
  startTime: string;
  endTime?: string;
  stops: { address: string; lat: number; lng: number }[];
  revenue: number;
}

export interface Request {
  id: string;
  passengerName: string;
  pickup: { address: string; lat: number; lng: number };
  dropoff: { address: string; lat: number; lng: number };
  status: 'new' | 'assigned' | 'in_progress' | 'completed';
  passengers: number;
  requestedAt: string;
  assignedAt?: string;
  completedAt?: string;
  vehicleId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface AnalyticsData {
  revenue: number;
  expenses: number;
  routeEfficiency: number;
  fuelEfficiency: number;
  waitTime: number;
  vehicleUtilization: number;
}
