import type { TravelSpot } from 'common/types/travelSpots';
import { useState } from 'react';
import { apiClient } from 'utils/apiClient';

const TravelDestination = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [travelSpots, setTravelSpots] = useState<TravelSpot[]>([]);

  const fetchTravelSpots = async () => {
    console.log('searchQuery', searchQuery);
    await apiClient.travelStartingSpot.$post({ body: { destination: searchQuery } }).then((res) => {
      setTravelSpots(res);
    });
  };
  return (
    <div>
      <h1>TravelDestination</h1>
      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <button onClick={fetchTravelSpots}>検索</button>
      <ul>
        {travelSpots.map((spot, index) => (
          <li key={index} style={{ borderBottom: '1px solid #ccc', padding: '20px 0' }}>
            <h2 style={{ margin: '0', fontSize: '1.5em' }}>名前：{spot.name}</h2>
            <p style={{ margin: '5px 0', color: '#555' }}>概要：{spot.description}</p>
            <br />
            <p style={{ margin: '5px 0', color: '#555' }}>住所:{spot.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TravelDestination;
