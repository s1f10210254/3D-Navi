export type LatAndLng = {
  latitude: number;
  longitude: number;
};

export type TravelSpot = {
  name: string;
  location: LatAndLng;
  description: string;
  categories: string;
  isSelected: boolean;
  index: number | null;
};
