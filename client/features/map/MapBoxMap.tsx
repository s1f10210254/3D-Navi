import type { LatAndLng, TravelSpot } from 'common/types/travelSpots';
import { useRef } from 'react';
import styles from './MapBoxMap.module.css';
import useMap from './useMap';
import { twoPointsDistance } from './utils/someVariables';

type MapBoxMapProps = {
  allDestinationSpots: TravelSpot[];
  currentLocation: LatAndLng;
};

const MapBoxMap = ({ allDestinationSpots, currentLocation }: MapBoxMapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLDivElement[]>([]);
  const currentLocationElement = useRef<HTMLDivElement | null>(null);
  const { isCarMoving } = useMap(
    allDestinationSpots,
    currentLocation,
    mapContainer,
    markerRef,
    currentLocationElement,
  );
  const totalDistanceRound = (distances: number[]) => {
    const allDistance = distances.reduce((total, num) => total + num, 0);
    return Math.round(allDistance * 100) / 100;
  };
  const distances = allDestinationSpots.map((spot) => {
    return twoPointsDistance(
      { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
      { latitude: spot.location.latitude, longitude: spot.location.longitude },
    );
  });
  const totalDistance = totalDistanceRound(distances);

  return (
    <>
      <div>
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
      <div className={!isCarMoving ? styles.travelResult : styles.none}>
        <h1>目的地到着！</h1>
        <h2>総距離：{totalDistance}km</h2>
      </div>
    </>
  );
};

export default MapBoxMap;
