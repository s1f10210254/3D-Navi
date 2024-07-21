import type { LatAndLng, TravelSpot } from 'common/types/travelSpots';
import { Header } from 'components/header/Header';
import { Loading } from 'components/loading/Loading';
import SelectedTravelSpotsMobile from 'components/mobile/selectedTravelSpotMobile/SelectedTravelSpotsMobile';
import SelectedTravelSpots from 'components/selectedTravelSpots/SelectedTravelSpots';
import MapBoxMap from 'features/map/MapBoxMap';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isMobileAtom, travelSpotsAtom } from 'utils/Atom';
import { getSelectedTravelSpots } from 'utils/selectedTravelSpots';
import styles from './index.module.css';

const SightseeingMap = () => {
  const [currentLocation, setCurrentLocation] = useState<LatAndLng | null>(null);
  const [travelSpots, setTravelSpots] = useAtom<TravelSpot[]>(travelSpotsAtom);
  const selectedSpots = getSelectedTravelSpots(travelSpots);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile] = useAtom(isMobileAtom);

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

  const router = useRouter();
  const onBackPage = () => {
    router.push('/travelSpotList');
  };

  const buttonType = router.pathname === '/sightseeingMap' ? 'sightseeingMap' : 'travelSpotList';

  if (!currentLocation) {
    return <Loading visible />;
  }

  return (
    <div className={styles.container}>
      <Loading visible={isLoading} />
      <Header />
      <div className={styles.main}>
        {isMobile ? (
          <SelectedTravelSpotsMobile
            selectedSpots={selectedSpots}
            setTravelSpots={setTravelSpots}
            buttonType={buttonType}
            onBackPage={onBackPage}
          />
        ) : (
          <SelectedTravelSpots
            selectedSpots={selectedSpots}
            setTravelSpots={setTravelSpots}
            buttonType={buttonType}
            onBackPage={onBackPage}
          />
        )}

        <MapBoxMap allDestinationSpots={selectedSpots} currentLocation={currentLocation} />
      </div>
    </div>
  );
};

export default SightseeingMap;
