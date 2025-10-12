export interface Hotel {
  id: string;
  name: string;
  destination: string;
  rating: number;
  pricePerNight: number;
  lateCheckIn: boolean;
  amenities: string[];
}