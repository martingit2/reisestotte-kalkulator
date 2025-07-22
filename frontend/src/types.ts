// Fil: frontend/src/types.ts
export interface TravelClaim {
  id: number;
  startAddress: string;
  destinationAddress: string;
  distanceKm: number;
  transportMode: string;
  calculatedSupport: number;
  createdAt: string;
}