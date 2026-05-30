import { Request } from '../types';

export const mockRequests: Request[] = [
  {
    id: 'r1',
    passengerName: 'Anita Desai',
    pickup: { address: 'Connaught Place, Delhi', lat: 28.6328, lng: 77.2197 },
    dropoff: { address: 'South Extension, Delhi', lat: 28.5355, lng: 77.391 },
    status: 'new',
    passengers: 2,
    requestedAt: '2026-05-28T10:15:00Z'
  },
  {
    id: 'r2',
    passengerName: 'Vijay Malhotra',
    pickup: { address: 'Dwarka Sector 21, Delhi', lat: 28.6139, lng: 77.209 },
    dropoff: { address: 'Nehru Place, Delhi', lat: 28.7041, lng: 77.1025 },
    status: 'assigned',
    passengers: 1,
    requestedAt: '2026-05-28T09:30:00Z',
    assignedAt: '2026-05-28T09:45:00Z',
    vehicleId: 'v4'
  },
  {
    id: 'r3',
    passengerName: 'Priya Sharma',
    pickup: { address: 'Rajouri Garden, Delhi', lat: 28.6562, lng: 77.2167 },
    dropoff: { address: 'Lajpat Nagar, Delhi', lat: 28.5678, lng: 77.2345 },
    status: 'in_progress',
    passengers: 3,
    requestedAt: '2026-05-28T08:45:00Z',
    assignedAt: '2026-05-28T09:00:00Z',
    vehicleId: 'v1'
  },
  {
    id: 'r4',
    passengerName: 'Karan Kapoor',
    pickup: { address: 'Greater Kailash, Delhi', lat: 28.5355, lng: 77.391 },
    dropoff: { address: 'Karol Bagh, Delhi', lat: 28.6517, lng: 77.1932 },
    status: 'completed',
    passengers: 1,
    requestedAt: '2026-05-28T07:30:00Z',
    assignedAt: '2026-05-28T07:45:00Z',
    completedAt: '2026-05-28T08:15:00Z',
    vehicleId: 'v2'
  }
];
