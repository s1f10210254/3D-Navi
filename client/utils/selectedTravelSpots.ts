import type { TravelSpot } from '../common/types/travelSpots';

// 選択されたTravelSpotを順番に取得する関数
export const getSelectedTravelSpots = (travelSpots: TravelSpot[]): TravelSpot[] => {
  return travelSpots
    .filter((spot) => spot.isSelected)
    .sort((a, b) => (a.index !== null && b.index !== null ? a.index - b.index : 0));
};
