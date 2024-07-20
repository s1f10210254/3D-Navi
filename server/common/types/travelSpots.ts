export type LatAndLng = {
  latitude: number;
  longitude: number;
};

export type TravelSpot = {
  name: string;
  location: LatAndLng;
  description: string;
  photoUrl: string | null;
  categories: string;
  isSelected: boolean;
  index: number | null;
};
