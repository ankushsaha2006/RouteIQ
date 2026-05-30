import { Vehicle } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    number: 'DL-01-H-1234',
    type: 'Truck',
    capacity: 5000,
    status: 'active',
    driverId: 'd1',
    location: { lat: 28.6139, lng: 77.209 },
    lastUpdate: '2026-05-28T10:30:00Z'
  },
  {
    id: 'v2',
    number: 'DL-01-H-5678',
    type: 'Van',
    capacity: 2000,
    status: 'idle',
    driverId: 'd2',
    location: { lat: 28.7041, lng: 77.1025 },
    lastUpdate: '2026-05-28T09:15:00Z'
  },
  {
    id: 'v3',
    number: 'DL-01-H-9012',
    type: 'Truck',
    capacity: 10000,
    status: 'maintenance',
    location: { lat: 28.5355, lng: 77.391 },
    lastUpdate: '2026-05-27T14:20:00Z'
  },
  {
    id: 'v4',
    number: 'DL-01-H-3456',
    type: 'Van',
    capacity: 1500,
    status: 'active',
    driverId: 'd3',
    location: { lat: 28.6562, lng: 77.2167 },
    lastUpdate: '2026-05-28T11:45:00Z'
  },
  {
    id: 'v5',
    number: 'DL-01-H-7890',
    type: 'Truck',
    capacity: 8000,
    status: 'idle',
    location: { lat: 28.6328, lng: 77.2197 },
    lastUpdate: '2026-05-28T08:30:00Z'
  }
];
