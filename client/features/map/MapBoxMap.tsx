import type { LatAndLng, TravelSpot } from 'common/types/travelSpots';
import SelectedTravelSpots from 'components/selectedTravelSpots/SelectedTravelSpots';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import { getSelectedTravelSpots } from 'utils/selectedTravelSpots';
import { travelSpotsAtom } from 'utils/travelSpotsAtom';
import styles from './MapBoxMap.module.css';
import useMap from './useMap';

type MapBoxMapProps = {
  allDestinationSpots: TravelSpot[];
  currentLocation: LatAndLng;
};

const MapBoxMap = ({ allDestinationSpots, currentLocation }: MapBoxMapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLDivElement[]>([]);
  const currentLocationElement = useRef<HTMLDivElement | null>(null);
  const { onBackPage } = useMap(
    allDestinationSpots,
    currentLocation,
    mapContainer,
    markerRef,
    currentLocationElement,
  );
  const [travelSpots, setTravelSpots] = useAtom<TravelSpot[]>(travelSpotsAtom);
  const selectedSpots = getSelectedTravelSpots(travelSpots);

  return (
    <div className={styles.container}>
      <div className={styles.selectedSpotListContainer}>
        <div className={styles.selectedSpotList}>
          <SelectedTravelSpots selectedSpots={selectedSpots} setTravelSpots={setTravelSpots} />
        </div>
        <button onClick={onBackPage}>戻る</button>
      </div>
      <div ref={mapContainer} className={styles.map} />

      {allDestinationSpots.map((spot, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el === null) return;
            markerRef.current[index] = el;
          }}
          className={styles.destinationPin}
        >
          <h3 className={styles.placeName}>{spot.name}</h3>
        </div>
      ))}

      <div ref={currentLocationElement} className={styles.currentLocationPin}>
        <h3 className={styles.currentName}>現在地</h3>
      </div>
    </div>
  );
};

export default MapBoxMap;
