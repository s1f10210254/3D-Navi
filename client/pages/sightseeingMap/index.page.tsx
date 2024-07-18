import type { LatAndLng, TravelSpot } from 'common/types/travelSpots';
import { Loading } from 'components/loading/Loading';
import MapBoxMap from 'features/map/MapBoxMap';
import { useEffect, useState } from 'react';

// デモデータ
const destinationSpots: TravelSpot[] = [
  {
    name: '東京ディズニーランド',
    location: {
      latitude: 35.6329,
      longitude: 139.8804,
    },
    description: '日本で一番楽しい場所',
    categories: 'テーマパーク',
    isSelected: true,
    index: 0,
  },
  {
    name: '東京スカイツリー',
    location: {
      latitude: 35.71,
      longitude: 139.810833,
    },
    description: '日本で一番高い建物',
    categories: '名所・史跡',
    isSelected: true,
    index: 1,
  },
  {
    name: '東京タワー',
    location: {
      latitude: 35.658611,
      longitude: 139.745556,
    },
    description: '日本で一番有名な観光地',
    categories: '名所・史跡',
    isSelected: true,
    index: 2,
  },
  {
    name: '赤羽',
    location: {
      latitude: 35.775,
      longitude: 139.720556,
    },
    description: '日本で一番美味しいラーメン',
    categories: 'グルメ・レストラン',
    isSelected: true,
    index: 3,
  },
];

const SightseeingMap = () => {
  const [currentLocation, setCurrentLocation] = useState<LatAndLng | null>(null);

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
      <h1>観光地マップ</h1>
      <MapBoxMap allDestinationSpots={destinationSpots} currentLocation={currentLocation} />
    </div>
  );
};

export default SightseeingMap;
