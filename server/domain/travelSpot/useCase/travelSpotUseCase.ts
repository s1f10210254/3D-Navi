import axios from 'axios';
import type { CheerioAPI } from 'cheerio';
import cheerio from 'cheerio';
export const travelSpotUseCase = {
  test: (travelStartingSpot: string): string => {
    console.log('travelStartingSpot', travelStartingSpot);
    return `行き先地: ${travelStartingSpot}`;
  },

  fetchTravelSpots: async (query: string): Promise<string[]> => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://www.japan47go.travel/ja/search/result?keyword=${encodedQuery}`;

      const { data } = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
        },
      });

      const $: CheerioAPI = cheerio.load(data);

      const travelSpots: string[] = [];
      $(
        '#__next > div > div > main > section:nth-child(3) > ul > li > a > div.flex.flex-col.overflow-hidden.gap-10.pt-15 > p.font-serif.font-medium.tracking-60.-my-4.text-16.leading-\\[24px\\].md\\:-my-5.md\\:text-18.md\\:leading-\\[28px\\]',
      ).each((index, element) => {
        if (index < 10) {
          // 10個までの結果を取得
          const spot = $(element).text().trim();
          travelSpots.push(spot);
        }
      });

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
