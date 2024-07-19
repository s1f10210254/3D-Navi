import type { LatAndLng } from 'common/types/travelSpots';

export const twoPointsDistance = (point1: LatAndLng, point2: LatAndLng): number => {
  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

  const R = 6371; // 地球の半径 (キロメートル)
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 距離 (キロメートル)

  return distance;
};

const zoomAndScaleObject = {
  small: {
    zoom: 12,
    scale: 400,
    speed: 0.1,
  },
  medium: {
    zoom: 8.5,
    scale: 5000,
    speed: 0.5,
  },
  large: {
    zoom: 7,
    scale: 10000,
    speed: 3,
  },
};

export const getZoomAndScaleAndSpeed = (distance: number) => {
  let zoom: number, scale: number, speed: number;
  if (distance < 50) {
    ({ zoom, scale, speed } = zoomAndScaleObject.small);
  } else if (distance < 5000) {
    ({ zoom, scale, speed } = zoomAndScaleObject.medium);
  } else {
    ({ zoom, scale, speed } = zoomAndScaleObject.large);
  }

  return { zoom, scale, speed };
};
