
import { Delivery, DeliveryStatus, Priority, RiderProfile } from '../types';

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'BR-1001',
    customerName: 'Sarah Jenkins',
    pickupAddress: 'Central Pizza Kitchen',
    address: '124 Maple Avenue, Springfield',
    items: ['Large Pepperoni Pizza', 'Coke 1.5L'],
    status: DeliveryStatus.PENDING,
    priority: Priority.HIGH,
    orderTime: '10:15 AM',
    distance: '3.2 km',
    estTime: '15 mins',
    price: 12.50,
    progress: 0,
    history: [{ status: DeliveryStatus.PENDING, time: '10:15 AM' }]
  },
  {
    id: 'BR-1002',
    customerName: 'Marcus Thorne',
    pickupAddress: 'Burger Joint HQ',
    address: '88 Oak Street, Heights',
    items: ['Double Beef Burger', 'Fries'],
    status: DeliveryStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    orderTime: '10:30 AM',
    distance: '1.5 km',
    estTime: '8 mins',
    price: 8.00,
    progress: 40,
    history: [{ status: DeliveryStatus.PENDING, time: '10:30 AM' }, { status: DeliveryStatus.IN_PROGRESS, time: '10:45 AM' }]
  },
  {
    id: 'BR-1003',
    customerName: 'Elena Gilbert',
    pickupAddress: 'Fresh Mart Warehouse',
    address: '22 River Road, Downtown',
    items: ['Grocery Pack A'],
    status: DeliveryStatus.DELIVERED,
    priority: Priority.LOW,
    orderTime: '09:00 AM',
    distance: '5.0 km',
    estTime: '25 mins',
    price: 15.00,
    progress: 100,
    history: [{ status: DeliveryStatus.DELIVERED, time: '09:30 AM' }]
  },
  {
    id: 'BR-1004',
    customerName: 'David Chen',
    pickupAddress: 'Zen Sushi Lounge',
    address: '55 Bamboo Grove',
    items: ['Sushi Set (24pcs)'],
    status: DeliveryStatus.PENDING,
    priority: Priority.MEDIUM,
    orderTime: '10:45 AM',
    distance: '4.1 km',
    estTime: '20 mins',
    price: 18.50,
    progress: 0,
    history: [{ status: DeliveryStatus.PENDING, time: '10:45 AM' }]
  }
];

export const RIDER_PROFILE: RiderProfile = {
  name: 'Alex "Bandit" Rodriguez',
  bikeModel: 'Honda CBR500R',
  totalDeliveries: 1248,
  rating: 4.9,
  earnings: 450.25,
  avatar: 'https://picsum.photos/seed/rider/200/200'
};
