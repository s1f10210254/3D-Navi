import axios from 'axios';
import type { LatAndLng } from 'common/types/travelSpots';
export const fetchCoordinates = async (address: string): Promise<LatAndLng | null> => {
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
