
import { LocationCoords } from '../types';

export const LAGOS_CENTER: LocationCoords = { lat: 6.5244, lng: 3.3792 };

export const getCurrentLocation = (): Promise<LocationCoords> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(LAGOS_CENTER);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => {
        resolve(LAGOS_CENTER); // Fallback
      }
    );
  });
};

export const generateRandomOffset = (base: LocationCoords, radiusKm: number): LocationCoords => {
  const y0 = base.lat;
  const x0 = base.lng;
  const rd = radiusKm / 111; // Approx conversion km to degrees

  const u = Math.random();
  const v = Math.random();
  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  return {
    lat: y + y0,
    lng: x + x0
  };
};
