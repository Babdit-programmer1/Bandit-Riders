
import { Delivery, DeliveryStatus, Priority, RiderProfile } from '../types';

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'BR-1001',
    customerName: 'Sarah Jenkins',
    pickupAddress: 'Victoria Island Central',
    address: 'Lekki Phase 1, Block 12',
    items: ['Corporate Documents'],
    status: DeliveryStatus.PENDING,
    priority: Priority.HIGH,
    orderTime: '10:15 AM',
    distance: '3.2 km',
    estTime: '15 mins',
    price: 1850,
    progress: 0,
    history: [{ status: DeliveryStatus.PENDING, time: '10:15 AM' }]
  },
  {
    id: 'BR-1002',
    customerName: 'Marcus Thorne',
    pickupAddress: 'Ikeja City Mall',
    address: 'Maryland Estate, G-Lane',
    items: ['Electronic Component'],
    status: DeliveryStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    orderTime: '10:30 AM',
    distance: '1.5 km',
    estTime: '8 mins',
    price: 1200,
    progress: 40,
    history: [{ status: DeliveryStatus.PENDING, time: '10:30 AM' }, { status: DeliveryStatus.IN_PROGRESS, time: '10:45 AM' }]
  },
  {
    id: 'BR-1003',
    customerName: 'Elena Gilbert',
    pickupAddress: 'Apapa Wharf Hub',
    address: 'Surulere, Adeniran St.',
    items: ['Spare Parts'],
    status: DeliveryStatus.DELIVERED,
    priority: Priority.LOW,
    orderTime: '09:00 AM',
    distance: '5.0 km',
    estTime: '25 mins',
    price: 3500,
    progress: 100,
    history: [{ status: DeliveryStatus.DELIVERED, time: '09:30 AM' }]
  }
];

export const RIDER_PROFILE: RiderProfile = {
  name: 'Alex "Bandit" Rodriguez',
  bikeModel: 'Honda CBR500R',
  totalDeliveries: 1248,
  rating: 4.9,
  earnings: 85400,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
};
