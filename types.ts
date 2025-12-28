
export enum DeliveryStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  PICKED_UP = 'Picked Up',
  /* Added IN_PROGRESS to fix "Property does not exist" errors in components and data files */
  IN_PROGRESS = 'In Progress',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export type UserRole = 'rider' | 'sender';

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Credential {
  id: string;
  label: string;
  icon: string;
  issueDate: string;
}

export interface User {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  isAuthenticated: boolean;
  phone?: string;
  vehicleType?: string;
  plateNumber?: string;
  isAvailable?: boolean;
  location?: LocationCoords;
  totalEarnings?: number;
  totalDeliveries?: number;
  credentials?: Credential[];
  reviews?: Review[];
}

export interface WalletTransaction {
  id: string;
  type: 'fund' | 'payment';
  amount: number;
  description: string;
  date: string;
}

export interface WalletData {
  balance: number;
  transactions: WalletTransaction[];
}

export interface Delivery {
  id: string;
  customerName: string;
  address: string;
  pickupAddress: string;
  items: string[];
  status: DeliveryStatus;
  priority: Priority;
  orderTime: string;
  distance: string;
  estTime: string;
  price: number;
  fareBreakdown?: FareBreakdownData;
  riderName?: string;
  riderAvatar?: string;
  riderPlate?: string;
  progress: number; 
  history: { status: DeliveryStatus; time: string }[];
}

export interface FareBreakdownData {
  base: number;
  distanceCost: number;
  timeCost: number;
  multiplier: number;
  total: number;
}

export interface BookingEstimate {
  price: number;
  distance: string;
  duration: string;
  reasoning: string;
  breakdown: FareBreakdownData;
}

export interface RiderProfile {
  name: string;
  bikeModel: string;
  totalDeliveries: number;
  rating: number;
  earnings: number;
  avatar: string;
}

export type CustomerView = 'landing' | 'booking' | 'tracking';
