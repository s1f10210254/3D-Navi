import { useState } from 'react';
import { apiClient } from 'utils/apiClient';

const TravelDestination = () => {
  const [destination, setDestination] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const serch = async () => {
    console.log('destination', destination);
    await apiClient.travel_starting_spot.post({ body: { destination } }).then((res) => {
      console.log('res', res);
      setResponse(res.body);
    });
  };

  return (
    <div>
      <h1>Destination</h1>
      <input value={destination} onChange={(e) => setDestination(e.target.value)} />
      <button onClick={serch}>検索</button>
      <p>{response}</p>
    </div>
  );
};
export default TravelDestination;
