import axios from 'axios';
import type { CheerioAPI } from 'cheerio';
import cheerio from 'cheerio';
import type { TravelSpot } from 'common/types/travelSpots';
import { fetchCoordinates } from './coordinateService';

export const getTravelSpotDetails = async (
  url: string,
  category: string,
): Promise<TravelSpot | null> => {
  try {
    const { data } = await axios.get(url);
    const $: CheerioAPI = cheerio.load(data);

    const name = $(
      '#main_container > main > div.shisetsu_contentBody > div > section > div > div > dl:nth-child(1) > dd',
    )
      .text()
      .trim();

    const description = $(
      '#main_container > main > div.shisetsu_contentBody > div > section > div > div.shisetsu_lede > p',
    )
      .text()
      .trim();

    const address = $(
      '#main_container > main > div.shisetsu_contentBody > div > section > div > div.shisetsu_informationList > dl:nth-child(2) > dd > ul > li:nth-child(1)',
    )
      .text()
      .trim();

    const coordinates = await fetchCoordinates(address);

    if (coordinates) {
      return {
        name,
        location: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        description,
        categories: category,
        isSelected: false,
        index: null,
      };
    } else {
      return {
        name,
        location: {
          latitude: 0,
          longitude: 0,
        },
        description,
        categories: category,
        isSelected: false,
        index: null,
      };
    }
  } catch (error) {
    console.error('Error fetching travel spot details:', error);
    return null;
  }
};
