import MapboxLanguage from '@mapbox/mapbox-gl-language';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import type { LatAndLng, TouristSpot } from './types';

const MAPBOX_BASE_URL = 'https://api.mapbox.com';

const displayRoute = async (map: mapboxgl.Map, waypoints: [number, number][]) => {
  const coords = waypoints.map((point) => point.join(',')).join(';');
  const requestUrl = new URL(
    `${MAPBOX_BASE_URL}/directions/v5/mapbox/driving/${coords}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
  );

  const query = await fetch(requestUrl, { method: 'GET' });

  if (query.status !== 200) {
    alert('ルートの取得に失敗しました');
    return;
  }
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route,
    },
  };
  if (map.getSource('route-details')) {
    (map.getSource('route-details') as mapboxgl.GeoJSONSource).setData(geojson);
  } else {
    map.addSource('route-details', {
      type: 'geojson',
      data: geojson,
    });
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route-details',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'blue',
        'line-width': 5,
        'line-opacity': 0.75,
      },
    });
    map.addLayer(
      {
        id: 'routearrows',
        type: 'symbol',
        source: 'route-details',
        layout: {
          'symbol-placement': 'line',
          'text-field': '▶',
          'text-size': ['interpolate', ['linear'], ['zoom'], 12, 24, 22, 60],
          'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 12, 30, 22, 160],
          'text-keep-upright': false,
        },
        paint: {
          'text-color': 'black',
          'text-halo-color': 'white',
          'text-halo-width': 2,
        },
      },
      'waterway-label',
    );
  }
};

const useMap = (
  allDestinationSpots: TouristSpot[],
  currentLocation: LatAndLng,
  mapContainer: React.RefObject<HTMLDivElement>,
  markerRef: React.MutableRefObject<HTMLDivElement[]>,
) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedSpots, setSelectedSpots] = useState<TouristSpot[]>([]);

  useEffect(() => {
    const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    if (MAPBOX_API_KEY === undefined)
      throw new Error(
        'Mapbox API key is not defined. Please set NEXT_PUBLIC_MAPBOX_API_KEY in your environment variables',
      );
    mapboxgl.accessToken = MAPBOX_API_KEY;

    if (!mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current ?? '',
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [139.810833, 35.71],
      zoom: 10,
    });

    const language = new MapboxLanguage({ defaultLanguage: 'ja' });
    mapRef.current.addControl(language);
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    const currentLocationMarker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat([currentLocation.longitude, currentLocation.latitude])
      .setPopup(new mapboxgl.Popup().setHTML('現在地'))
      .addTo(mapRef.current);

    currentLocationMarker.togglePopup();
    mapRef.current.setCenter([currentLocation.longitude, currentLocation.latitude]);

    allDestinationSpots.forEach((spot, index) => {
      const markerElement = markerRef.current[index];
      if (!markerElement || mapRef.current === null) return;

      new mapboxgl.Marker(markerElement)
        .setLngLat([spot.location.longitude, spot.location.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${spot.name}</h3><p>${spot.description}</p>`))
        .addTo(mapRef.current);
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [allDestinationSpots, currentLocation, mapContainer, mapRef, markerRef]);

  const onDestinationMarkerClick = (index: number) => {
    if (selectedSpots.includes(allDestinationSpots[index])) {
      setSelectedSpots(selectedSpots.filter((spot) => spot !== allDestinationSpots[index]));
    } else {
      setSelectedSpots([...selectedSpots, allDestinationSpots[index]]);
    }
  };

  const onDecide = async () => {
    if (mapRef.current === null) return;
    if (mapRef.current.isStyleLoaded()) {
      const waypoints: [number, number][] = selectedSpots.map((spot) => [
        spot.location.longitude,
        spot.location.latitude,
      ]);
      waypoints.unshift([currentLocation.longitude, currentLocation.latitude]);
      if (waypoints.length > 1) {
        await displayRoute(mapRef.current, waypoints);
      } else {
        alert('行き先を2つ以上選択してください');
      }
    }
  };

  return { mapRef, selectedSpots, onMarkerClick: onDestinationMarkerClick, onDecide };
};

export default useMap;
