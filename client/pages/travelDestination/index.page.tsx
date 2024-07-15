import { useState } from 'react';
import { apiClient } from 'utils/apiClient';

const TravelDestination = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [travelSpots, setTravelSpots] = useState<string[]>([]);

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
          <li key={index}>{spot}</li>
        ))}
      </ul>
    </div>
  );
};
export default TravelDestination;
