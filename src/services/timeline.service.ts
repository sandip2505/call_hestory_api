import type { ILocation } from '../models/Location.js';

export interface TimelineVisit {
  latitude: number;
  longitude: number;
  arrivalTime: Date;
  departureTime: Date;
  duration: number; // in minutes
  address?: string; // Optional reverse geocoding result
}

// Haversine formula to calculate distance in meters
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const generateTimeline = (
  locations: ILocation[],
  radiusMeters: number = 50,
  minDurationMinutes: number = 5
): TimelineVisit[] => {
  if (!locations || locations.length === 0) return [];

  // Ensure locations are sorted by timestamp ascending
  const sorted = [...locations].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const visits: TimelineVisit[] = [];
  
  let clusterStart = sorted[0];
  let clusterEnd = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]!;
    const distance = getDistance(
      clusterStart!.latitude,
      clusterStart!.longitude,
      current.latitude,
      current.longitude
    );

    if (distance <= radiusMeters) {
      // Still in the same area
      clusterEnd = current;
    } else {
      // Moved out of radius, check if the previous cluster was a meaningful stop
      const durationMs = clusterEnd!.timestamp.getTime() - clusterStart!.timestamp.getTime();
      const durationMinutes = durationMs / (1000 * 60);

      if (durationMinutes >= minDurationMinutes) {
        visits.push({
          latitude: clusterStart!.latitude, // Or average lat/lng
          longitude: clusterStart!.longitude,
          arrivalTime: clusterStart!.timestamp,
          departureTime: clusterEnd!.timestamp,
          duration: Math.round(durationMinutes),
        });
      }

      // Start new cluster
      clusterStart = current;
      clusterEnd = current;
    }
  }

  // Check the last cluster
  const finalDurationMs = clusterEnd!.timestamp.getTime() - clusterStart!.timestamp.getTime();
  const finalDurationMinutes = finalDurationMs / (1000 * 60);
  if (finalDurationMinutes >= minDurationMinutes) {
    visits.push({
      latitude: clusterStart!.latitude,
      longitude: clusterStart!.longitude,
      arrivalTime: clusterStart!.timestamp,
      departureTime: clusterEnd!.timestamp,
      duration: Math.round(finalDurationMinutes),
    });
  }

  return visits;
};
