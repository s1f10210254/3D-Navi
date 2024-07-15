import axios from 'axios';
import type { CheerioAPI } from 'cheerio';
import cheerio from 'cheerio';
import type { TravelSpot } from 'common/types/travelSpots';
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

      const travelNames: string[] = [];
      const travelURLs: string[] = [];
      $('#main > div.search_result > div.item.spot_list > ul > li > p > a ').each(
        (index, element) => {
          if (index < 3) {
            // 10個までの結果を取得
            const spotName = $(element).text().trim();
            travelNames.push(spotName);
            const href = $(element).attr('href');
            if (href) {
              travelURLs.push(href);
            }
          }
        },
      );

      const travelSpots: TravelSpot[] = [];

      for (let i = 0; i < travelURLs.length; i++) {
        const { data } = await axios.get(travelURLs[i]);
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

        travelSpots.push({ name, description, address });
      }

      return travelSpots;
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
