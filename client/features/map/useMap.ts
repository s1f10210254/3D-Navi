import MapboxLanguage from '@mapbox/mapbox-gl-language';
import type { LatAndLng, TravelSpot } from 'common/types/travelSpots';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { staticPath } from 'utils/$path';
import { NEXT_PUBLIC_MAPBOX_API_KEY } from 'utils/envValues';
import { createCustomLayer } from './utils/3DCustomLayer';
import { displayRoute } from './utils/displayRoute';
import { getZoomAndScaleAndSpeed, twoPointsDistance } from './utils/someVariables';

const useMap = (
  allDestinationSpots: TravelSpot[],
  currentLocation: LatAndLng,
  mapContainer: React.RefObject<HTMLDivElement>,
  markerRef: React.MutableRefObject<HTMLDivElement[]>,
  currentLocationElement: React.RefObject<HTMLDivElement>,
) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const carLayerRef = useRef<any>(null);

  useEffect(() => {
    mapboxgl.accessToken = NEXT_PUBLIC_MAPBOX_API_KEY;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current ?? '',
      style: 'mapbox://styles/s-renren/clyu873j7003s01ri45eqgn2y',
      center: [139.810833, 35.71],
      zoom: 10,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });

    const language = new MapboxLanguage({ defaultLanguage: 'ja' });
    mapRef.current.addControl(language);
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    if (currentLocationElement.current) {
      new mapboxgl.Marker(currentLocationElement.current)
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .addTo(mapRef.current);
    }

    mapRef.current.setCenter([currentLocation.longitude, currentLocation.latitude]);

    allDestinationSpots.forEach((spot, index) => {
      const markerElement = markerRef.current[index];
      if (!markerElement || mapRef.current === null) return;

      new mapboxgl.Marker(markerElement)
        .setLngLat([spot.location.longitude, spot.location.latitude])
        .addTo(mapRef.current);
    });

    mapRef.current.on('load', async () => {
      if (mapRef.current?.isStyleLoaded()) {
        const waypoints: [number, number][] = allDestinationSpots.map((spot) => [
          spot.location.longitude,
          spot.location.latitude,
        ]);
        waypoints.unshift([currentLocation.longitude, currentLocation.latitude]);
        await displayRoute(mapRef.current, waypoints, carLayerRef);
      }
    });

    const distances = allDestinationSpots.map((spot) => {
      return twoPointsDistance(
        { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
        { latitude: spot.location.latitude, longitude: spot.location.longitude },
      );
    });
    const mostLargeDistance = Math.max(...distances);

    const { scale } = getZoomAndScaleAndSpeed(mostLargeDistance);

    const carCustomLayer = createCustomLayer(
      mapRef,
      currentLocation,
      staticPath.models.car.scene_gltf,
      scale,
    );

    mapRef.current.on('load', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapRef.current?.addLayer(carCustomLayer as any, 'waterway-label');
      carLayerRef.current = carCustomLayer;
    });
    return () => {
      mapRef.current?.remove();
    };
  }, [
    allDestinationSpots,
    currentLocation,
    mapContainer,
    mapRef,
    markerRef,
    currentLocationElement,
    carLayerRef,
  ]);

  return {};
};

export default useMap;
