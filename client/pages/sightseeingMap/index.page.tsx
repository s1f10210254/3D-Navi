import type { LatAndLng, TravelSpot } from 'common/types/travelSpots';
import { Loading } from 'components/loading/Loading';
import MapBoxMap from 'features/map/MapBoxMap';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { travelSpotsAtom } from 'utils/travelSpotsAtom';

const SightseeingMap = () => {
  const [currentLocation, setCurrentLocation] = useState<LatAndLng | null>(null);
  const [travelSpots] = useAtom<TravelSpot[]>(travelSpotsAtom);
  const selectedSpots = travelSpots.filter((spot) => spot.isSelected);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ latitude, longitude });
    });
  }, []);

  if (!currentLocation) {
    return <Loading visible />;
  }

  return (
    <div>
      <MapBoxMap allDestinationSpots={selectedSpots} currentLocation={currentLocation} />
    </div>
  );
};

export default SightseeingMap;
