export type LatAndLng = {
  latitude: number;
  longitude: number;
};

export type TravelSpot = {
  name: string;
  location: LatAndLng;
  description: string;
};
