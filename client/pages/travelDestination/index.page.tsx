import type { TravelSpot } from 'common/types/travelSpots';
import styles from 'pages/travelDestination/index.module.css';
import { useState } from 'react';
import { apiClient } from 'utils/apiClient';

const TravelDestination = () => {
  const [destination, setDestination] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const imageUrl = '';
  const serch = async () => {
    console.log('destination', destination);
    await apiClient.travelStartingSpot.post({ body: { destination } }).then((res) => {
      console.log('res', res);
      setResponse(res.body);
    });
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [travelSpots, setTravelSpots] = useState<TravelSpot[]>([]);

  const fetchTravelSpots = async () => {
    console.log('searchQuery', searchQuery);
    await apiClient.travelStartingSpot.$post({ body: { destination: searchQuery } }).then((res) => {
      setTravelSpots(res);
    });
  };
  return (
    <div className={styles.container}>
      <h1 style={{ fontSize: '50px', textAlign: 'center', width: '600px', height: '200px' }}>
        TravelDestination
        <br />
      </h1>
      {/* ここになにかしらのアイコン画像を入れいる */}
      <img src={imageUrl} alt="Google Image" style={{ width: '300px', height: 'auto' }} />
      <p>行きたい場所を入力してください</p>
      <div className={styles.box}>
        <div className={styles.subject}>移動手段</div>
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
        <div className={styles.subject}>観光地</div>
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={styles.inp}
          placeholder="例:京都"
        />
      </div>
      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <button onClick={serch} className={styles.serch}>
        検索
      </button>
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
      <p>{response}</p>
    </div>
  );
};
export default TravelDestination;
