
import { FareBreakdownData } from '../types';

export const calculateFare = (distanceKm: number, durationMins: number): FareBreakdownData => {
  const BASE_FARE = 500;
  const PER_KM = 150;
  const PER_MIN = 50;
  
  const hour = new Date().getHours();
  let multiplier = 1.0;
  // Surge pricing for Lagos rush hours
  if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
    multiplier = 1.65;
  }
  
  const distanceCost = distanceKm * PER_KM;
  const timeCost = durationMins * PER_MIN;
  const total = (BASE_FARE + distanceCost + timeCost) * multiplier;

  return {
    base: BASE_FARE,
    distanceCost: Math.round(distanceCost),
    timeCost: Math.round(timeCost),
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
