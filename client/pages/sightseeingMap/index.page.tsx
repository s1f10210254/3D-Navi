import type { LatAndLng, TravelSpot } from 'common/types/travelSpots';
import { Header } from 'components/header/Header';
import { Loading } from 'components/loading/Loading';
import SelectedTravelSpots from 'components/selectedTravelSpots/SelectedTravelSpots';
import MapBoxMap from 'features/map/MapBoxMap';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { getSelectedTravelSpots } from 'utils/selectedTravelSpots';
import { travelSpotsAtom } from 'utils/travelSpotsAtom';
import styles from './index.module.css';

const SightseeingMap = () => {
  const [currentLocation, setCurrentLocation] = useState<LatAndLng | null>(null);
  const [travelSpots, setTravelSpots] = useAtom<TravelSpot[]>(travelSpotsAtom);
  const selectedSpots = getSelectedTravelSpots(travelSpots);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ latitude, longitude });
    });

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!currentLocation) {
    return <Loading visible />;
  }

  return (
    <div className={styles.container}>
      <Loading visible={isLoading} />
      <Header />
      <div className={styles.main}>
        <SelectedTravelSpots selectedSpots={selectedSpots} setTravelSpots={setTravelSpots} />
        <MapBoxMap allDestinationSpots={selectedSpots} currentLocation={currentLocation} />
        {/* <button onClick={onBackPage}>戻る</button> */}
      </div>
    </div>
  );
};

export default SightseeingMap;
