import type { LatAndLng, TravelSpot } from 'common/types/travelSpots';
import { useRef } from 'react';
import styles from './MapBoxMap.module.css';
import useMap from './useMap';

type MapBoxMapProps = {
  allDestinationSpots: TravelSpot[];
  currentLocation: LatAndLng;
};

const MapBoxMap = ({ allDestinationSpots, currentLocation }: MapBoxMapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLDivElement[]>([]);
  const { selectedSpots, onMarkerClick, onDecide } = useMap(
    allDestinationSpots,
    currentLocation,
    mapContainer,
    markerRef,
  );

  return (
    <div>
      <div ref={mapContainer} style={{ height: '100vh' }} />

      {allDestinationSpots.map((spot, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el === null) return;
            markerRef.current[index] = el;
          }}
          onClick={() => onMarkerClick(index)}
          className={styles.destinationPin}
        >
          <h3 className={styles.placeName}>{spot.name}</h3>
        </div>
      ))}

      <div>
        {selectedSpots.map((spot, index) => (
          <div key={index}>
            <h3>{spot.name}</h3>
          </div>
        ))}
      </div>

      <button onClick={onDecide}>行き先決定</button>
    </div>
  );
};

export default MapBoxMap;
