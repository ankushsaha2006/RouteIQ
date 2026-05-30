import { Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'New Assignment',
    message: 'You have a new delivery assignment from Main Warehouse',
    type: 'info',
    timestamp: '2026-05-28T10:30:00Z',
    read: false
  },
  {
    id: 'n2',
    title: 'Route Optimization',
    message: 'AI has optimized your route. Estimated time saved: 25 minutes',
    type: 'success',
    timestamp: '2026-05-28T09:15:00Z',
    read: true
  },
  {
    id: 'n3',
    title: 'Maintenance Due',
    message: 'Vehicle DL-01-H-1234 is due for maintenance in 2 days',
    type: 'warning',
    timestamp: '2026-05-28T08:45:00Z',
    read: false
  },
  {
    id: 'n4',
    title: 'Payment Received',
    message: '?4,500 received for assignment #A123',
    type: 'success',
    timestamp: '2026-05-27T17:30:00Z',
    read: true
  }
];
