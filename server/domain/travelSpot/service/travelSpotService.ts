import axios from 'axios';
import type { CheerioAPI } from 'cheerio';
import cheerio from 'cheerio';
import type { LatAndLng, TravelSpot } from 'common/types/travelSpots';

const fetchCoordinates = async (address: string): Promise<LatAndLng | null> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodedAddress}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.length > 0) {
      const { geometry } = data[0];
      const { coordinates } = geometry;
      const [lng, lat] = coordinates;
      return { latitude: lat, longitude: lng };
    } else {
      console.error('No coordinates found for address:', address);
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

export const fetchTravelSpotDetails = async (url: string): Promise<TravelSpot | null> => {
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

    // カテゴリ情報をオブジェクトとして格納
    const categories: Record<string, string[]> = {};

    $(
      '#main_container > main > div.shisetsu_contentBody > div > section > div > div.shisetsu_informationList > dl',
    ).each((index, element) => {
      const dtText = $(element).find('dt').text().trim();
      if (dtText.includes('カテゴリ')) {
        $(element)
          .find('dd > ol')
          .each((_, olElement) => {
            const mainCategory = $(olElement).find('li:nth-child(1) > a').text().trim();
            const subCategory = $(olElement).find('li:nth-child(2) > a').text().trim();
            if (mainCategory) {
              if (!categories[mainCategory]) {
                categories[mainCategory] = [];
              }
              if (subCategory && !categories[mainCategory].includes(subCategory)) {
                categories[mainCategory].push(subCategory);
              }
            }
          });
      }
    });

    if (coordinates) {
      return {
        name,
        location: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        description,
        categories,
      };
    } else {
      return {
        name,
        location: {
          latitude: 0,
          longitude: 0,
        },
        description,
        categories,
      };
    }
  } catch (error) {
    console.error('Error fetching travel spot details:', error);
    return null;
  }
};

export const extractTravelSpotLinks = ($: CheerioAPI): string[] => {
  const travelURLs: string[] = [];
  $('#main > div.search_result > div.item.spot_list > ul > li > p > a ').each((index, element) => {
    if (index < 3) {
      const href = $(element).attr('href');
      if (href) {
        travelURLs.push(href);
      }
    }
  });
  return travelURLs;
};
