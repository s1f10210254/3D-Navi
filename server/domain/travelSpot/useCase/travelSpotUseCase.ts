import axios from 'axios';
import type { CheerioAPI } from 'cheerio';
import cheerio from 'cheerio';
import type { TravelSpot } from 'common/types/travelSpots';
import { extractTravelSpotLinks, fetchTravelSpotDetails } from '../service/travelSpotService';

export const travelSpotUseCase = {
  test: (travelStartingSpot: string): string => {
    console.log('travelStartingSpot', travelStartingSpot);
    return `行き先地: ${travelStartingSpot}`;
  },

  fetchTravelSpots: async (query: string): Promise<TravelSpot[]> => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://4travel.jp/search/shisetsu/dm?sa=${encodedQuery}`;

      const { data } = await axios.get(url);

      const $: CheerioAPI = cheerio.load(data);

      const travelURLs = extractTravelSpotLinks($);

      const travelSpotPromises = travelURLs.map((url) => fetchTravelSpotDetails(url));
      const travelSpots = await Promise.all(travelSpotPromises);

      return travelSpots.filter((spot) => spot !== null);
    } catch (error) {
      console.error('Error fetching travel spots:', error);
      if (axios.isAxiosError(error)) {
        // Axiosエラーの場合
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);
      } else if (error instanceof Error) {
        // 一般的なエラーの場合
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
      return [];
    }
  },
};
