
export enum DeliveryStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  PICKED_UP = 'Picked Up',
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

/**
 * Added RiderCredential and RiderReview to define the structure 
 * of rider achievements and feedback in the dispatch network.
 */
export interface RiderCredential {
  id: string;
  label: string;
  icon: string;
  issueDate: string;
}

export interface RiderReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
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
  totalEarnings?: number;
  // Added optional credentials and reviews to support rider portfolio features
  credentials?: RiderCredential[];
  reviews?: RiderReview[];
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

export interface FareBreakdownData {
  base: number;
  distanceCost: number;
  timeCost: number;
  multiplier: number;
  total: number;
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

export interface BookingEstimate {
  price: number;
  distance: string;
  duration: string;
  reasoning: string;
  breakdown: FareBreakdownData;
}

/**
 * Added RiderProfile for use in the Header, Profile pages, 
 * and as a central type for rider performance metrics.
 */
export interface RiderProfile {
  name: string;
  bikeModel: string;
  totalDeliveries: number;
  rating: number;
  earnings: number;
  avatar: string;
}

/**
 * Added CustomerView for state management within the sender portal navigation.
 */
export type CustomerView = 'landing' | 'booking' | 'tracking';
