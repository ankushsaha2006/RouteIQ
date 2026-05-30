// src/data/mockAssignments.ts
import { Assignment } from '../types/index';

export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Warehouse to Retail Outlet',
    status: 'active',
    vehicleId: 'v1',
    driverId: 'd1',
    startTime: '2026-05-28T08:00:00Z',
    stops: [
      { address: 'Main Warehouse, Delhi', lat: 28.6139, lng: 77.209 },
      { address: 'Retail Store A, Delhi', lat: 28.6328, lng: 77.2197 },
      { address: 'Retail Store B, Delhi', lat: 28.6562, lng: 77.2167 }
    ],
    revenue: 4500
  },
  {
    id: 'a2',
    title: 'Express Delivery',
    status: 'pending',
    vehicleId: 'v4',
    driverId: 'd3',
    startTime: '2026-05-28T14:00:00Z',
    stops: [
      { address: 'Distribution Center, Delhi', lat: 28.7041, lng: 77.1025 },
      { address: 'Customer Location, Delhi', lat: 28.5355, lng: 77.391 }
    ],
    revenue: 2200
  },
  {
    id: 'a3',
    title: 'City Distribution Run',
    status: 'completed',
    vehicleId: 'v1',
    driverId: 'd1',
    startTime: '2026-05-27T09:00:00Z',
    endTime: '2026-05-27T13:30:00Z',
    stops: [
      { address: 'Central Depot, Delhi', lat: 28.6139, lng: 77.209 },
      { address: 'Store 1, Delhi', lat: 28.6328, lng: 77.2197 },
      { address: 'Store 2, Delhi', lat: 28.6562, lng: 77.2167 },
      { address: 'Store 3, Delhi', lat: 28.5355, lng: 77.391 }
    ],
    revenue: 6800
  }
];
