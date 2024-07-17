import type { TravelSpot } from 'common/types/travelSpots';
import styles from 'pages/travelDestination/index.module.css';
import { useState } from 'react';
import { apiClient } from 'utils/apiClient';

const TravelDestination = () => {
  const imageUrl = '';
  const [userDestination, setUserDestination] = useState<string>('');
  const [travelSpots, setTravelSpots] = useState<TravelSpot[]>([]);

  const fetchTravelSpots = async () => {
    const res = await apiClient.travelStartingSpot.$post({
      body: { destination: userDestination },
    });
    setTravelSpots(res);
    console.log(travelSpots.map((spot) => spot.categories));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        TravelDestination
        <br />
      </h1>
      {/* ここになにかしらのアイコン画像を入れいる */}
      <img src={imageUrl} alt="Google Image" className={styles.image} />
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
          value={userDestination}
          onChange={(e) => setUserDestination(e.target.value)}
          className={styles.inp}
          placeholder="例:京都"
        />
      </div>
      <button onClick={fetchTravelSpots} className={styles.search}>
        検索
      </button>
      <ul>
        {travelSpots.map((spot, index) => (
          <li key={index} className={styles.listItem}>
            <h2 className={styles.listTitle}>名前：{spot.name}</h2>
            <p className={styles.listDescription}>概要：{spot.description}</p>
            <br />
            <p className={styles.listDescription}>カテゴリ：{spot.categories}</p>
            <p className={styles.listDescription}>
              緯度:{spot.location.latitude}、経度:{spot.location.longitude}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TravelDestination;
