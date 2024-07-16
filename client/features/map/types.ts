export type LatAndLng = {
  latitude: number;
  longitude: number;
};

export type TouristSpot = {
  name: string;
  location: LatAndLng;
  description?: string;
};
