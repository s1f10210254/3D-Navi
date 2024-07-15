import MapboxLanguage from '@mapbox/mapbox-gl-language';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import type { LatAndLng, TouristSpot } from './types';

type MapBoxMapProps = {
  allDestinationSpots: TouristSpot[];
  currentLocation: LatAndLng;
};

const MAPBOX_BASE_URL = 'https://api.mapbox.com';

const MapBoxMap = ({ allDestinationSpots, currentLocation }: MapBoxMapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<HTMLDivElement[]>([]);

  const [selectedSpots, setSelectedSpots] = useState<TouristSpot[]>([]);

  // 地図の初期化
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? '';

    if (!mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current ?? '',
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [139.810833, 35.71], // 初期表示の中心座標
      zoom: 10, // 初期表示のズームレベル高いほど拡大
    });

    const language = new MapboxLanguage({ defaultLanguage: 'ja' });
    mapRef.current.addControl(language);

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    // 現在地のマーカー
    const marker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat([currentLocation.longitude, currentLocation.latitude])
      .setPopup(new mapboxgl.Popup().setHTML('現在地'))
      .addTo(mapRef.current);

    marker.togglePopup();
    // カメラを現在地に移動
    mapRef.current.setCenter([currentLocation.longitude, currentLocation.latitude]);

    // マーカーの追加
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
  }, [allDestinationSpots, currentLocation]);

  //ルートの取得と表示
  const displayRoute = async (waypoints: [number, number][]) => {
    const coords = waypoints?.map((point) => point.join(',')).join(';');
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
    if (mapRef.current === null) return;
    if (mapRef.current.getSource('route-details')) {
      (mapRef.current.getSource('route-details') as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      mapRef.current.addSource('route-details', {
        type: 'geojson',
        data: geojson,
      });
      // ルートの線
      mapRef.current.addLayer({
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
      // ルートの進行方向矢印
      mapRef.current.addLayer(
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

  const onMarkerClick = (index: number) => {
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
      // waypointsの先頭に現在地を追加
      waypoints.unshift([currentLocation.longitude, currentLocation.latitude]);
      if (waypoints.length > 1) {
        await displayRoute(waypoints);
      } else {
        alert('行き先を2つ以上選択してください');
      }
    }
  };

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
          style={{
            width: '20px',
            height: '20px',
            color: 'red',
            backgroundColor: 'red',
            borderRadius: '50%',
          }}
        />
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
