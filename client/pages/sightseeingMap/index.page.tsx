import MapBoxMap from 'features/map/MapBoxMap';
import type { TouristSpot } from 'features/map/types';

// デモデータ
const destinationSpots: TouristSpot[] = [
  {
    name: '東京ディズニーランド',
    location: {
      latitude: 35.6329,
      longitude: 139.8804,
    },
    description: '日本で一番楽しい場所',
  },
  {
    name: '東京スカイツリー',
    location: {
      latitude: 35.71,
      longitude: 139.810833,
    },
    description: '日本で一番高い建物',
  },
  {
    name: '東京タワー',
    location: {
      latitude: 35.658611,
      longitude: 139.745556,
    },
    description: '日本で一番有名な観光地',
  },
  {
    name: '赤羽',
    location: {
      latitude: 35.775,
      longitude: 139.720556,
    },
    description: '日本で一番美味しいラーメン',
  },
];

const SightseeingMap = () => {
  return (
    <div>
      <h1>観光地マップ</h1>
      <MapBoxMap allDestinationSpots={destinationSpots} />
    </div>
  );
};

export default SightseeingMap;
