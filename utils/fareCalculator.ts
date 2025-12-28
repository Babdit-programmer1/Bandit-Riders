
import { FareBreakdownData } from '../types';

export const calculateFare = (distanceKm: number, durationMins: number): FareBreakdownData => {
  const BASE_FARE = 500;
  const PER_KM = 150;
  const PER_MIN = 50;
  
  // Simulated demand multiplier based on time of day
  const hour = new Date().getHours();
  let multiplier = 1.0;
  if (hour >= 16 && hour <= 19) multiplier = 1.5; // Rush hour
  else if (hour >= 7 && hour <= 9) multiplier = 1.2; // Morning rush
  
  const distanceCost = distanceKm * PER_KM;
  const timeCost = durationMins * PER_MIN;
  const total = (BASE_FARE + distanceCost + timeCost) * multiplier;

  return {
    base: BASE_FARE,
    distanceCost,
    timeCost,
    multiplier,
    total: Math.round(total)
  };
};

export const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount).replace('NGN', '₦');
};
