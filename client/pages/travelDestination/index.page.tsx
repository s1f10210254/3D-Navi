import styles from 'pages/travelDestination/index.module.css';
import { useState } from 'react';
import { apiClient } from 'utils/apiClient';

const TravelDestination = () => {
  const [destination, setDestination] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const serch = async () => {
    console.log('destination', destination);
    await apiClient.travelStartingSpot.post({ body: { destination } }).then((res) => {
      console.log('res', res);
      setResponse(res.body);
    });
  };

  return (
    <div className={styles.container}>
      <h1>TravelDestination</h1>
      <div className={styles.departureBox}>
        <div className={styles.depart}>出発</div>
        <input />
      </div>
      <div className={styles.arrivalBox}>
        <div className={styles.depart}>到着</div>
        <input value={destination} onChange={(e) => setDestination(e.target.value)} />
      </div>
      <button onClick={serch} className={styles.serch}>
        検索
      </button>
      <p>{response}</p>
    </div>
  );
};
export default TravelDestination;
