import type { TravelSpot } from 'common/types/travelSpots';
import { atom } from 'jotai';
export const travelSpotsAtom = atom<TravelSpot[]>([]);
export const isMobileAtom = atom<boolean>(false);
