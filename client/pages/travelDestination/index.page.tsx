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
      <div className={styles.box}>
        <div className={styles.subject}>交通手段</div>
        <select className={styles.sel}>
          <option>電車</option>
          <option>自動車</option>
          <option>徒歩</option>
        </select>
      </div>

      <div className={styles.box}>
        <div className={styles.subject}>出発地</div>
        <input className={styles.inp} />
      </div>
      <div className={styles.box}>
        <div className={styles.subject}>目的地</div>
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={styles.inp}
        />
      </div>
      <button onClick={serch} className={styles.serch}>
        検索
      </button>
      <p>{response}</p>
    </div>
  );
};
export default TravelDestination;
