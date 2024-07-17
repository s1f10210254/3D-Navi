import type { CheerioAPI } from 'cheerio';

export const extractTravelSpotData = ($: CheerioAPI): { url: string; category: string }[] => {
  const travelURLData: { url: string; category: string }[] = [];
  $('#main > div.search_result > div.item.spot_list > ul > li').each((index, element) => {
    const href = $(element).find('p > a').attr('href');
    const categoryNodes = $(element)
      .find('div > div > div.txt > p.category')
      .contents()
      .filter(function () {
        return this.nodeType === 3;
      });

    const categories = categoryNodes
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .join(',');

    if (href) {
      travelURLData.push({ url: href, category: categories });
    }
  });
  return travelURLData;
};
