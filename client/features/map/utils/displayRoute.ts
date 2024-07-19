import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import type { RefObject } from 'react';

const MAPBOX_BASE_URL = 'https://api.mapbox.com';

export const displayRoute = async (
  map: mapboxgl.Map,
  waypoints: [number, number][],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  carLayerRef: RefObject<any>,
) => {
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
  const geojson: GeoJSON.Feature = {
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

  if (carLayerRef?.current) {
    const line = turf.lineString(route);
    const totalDistance = turf.length(line);
    const speed = 0.01;
    const steps = Math.ceil(totalDistance / speed);
    const interval = totalDistance / steps;
    let step = 0;

    const moveCar = () => {
      if (step <= steps) {
        const segment = turf.along(line, interval * step);
        const coords = segment.geometry.coordinates;
        const nextSegment = turf.along(line, interval * (step + 1));
        const nextCoords = nextSegment.geometry.coordinates;

        const bearing = turf.bearing(turf.point(coords), turf.point(nextCoords));
        const closestDirection = getClosestDirection(bearing);
        carLayerRef.current.updateLngLat({
          latLng: [coords[0], coords[1]],
          bearing: closestDirection,
        });
        carLayerRef.current.updateCamera([coords[0], coords[1]]);
        step += 1;
        requestAnimationFrame(moveCar);
      }
    };
    moveCar();
  }
};

// 方位角を16方向に丸める関数
const getClosestDirection = (bearing: number): number => {
  const directions = [
    0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, -157.5, -135, -112.5, -90, -67.5, -45, -22.5,
  ];

  let closestDirection = directions[0];
  let minDiff = Math.abs(bearing - closestDirection);

  for (let i = 1; i < directions.length; i++) {
    const diff = Math.abs(bearing - directions[i]);
    if (diff < minDiff) {
      closestDirection = directions[i];
      minDiff = diff;
    }
  }

  // 東西はそのままに、南北を逆にする
  const fixDirections: Record<string, number> = {
    '0': 180,
    '22.5': 157.5,
    '45': 135,
    '67.5': 112.5,
    '90': 90,
    '112.5': 67.5,
    '135': 45,
    '157.5': 22.5,
    '180': 0,
    '-157.5': -22.5,
    '-135': -45,
    '-112.5': -67.5,
    '-90': -90,
    '-67.5': -112.5,
    '-45': -135,
    '-22.5': -157.5,
  };

  const str = closestDirection.toString();
  const fixedDirection = fixDirections[str];

  return fixedDirection;
};
