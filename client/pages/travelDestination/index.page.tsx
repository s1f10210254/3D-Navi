import { Header } from 'components/header/Header';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import styles from 'pages/travelDestination/index.module.css';
import { useState } from 'react';
import { apiClient } from 'utils/apiClient';
import { travelSpotsAtom } from 'utils/travelSpotsAtom';

const TravelDestination = () => {
  const imageUrl = '';
  const [userDestination, setUserDestination] = useState<string>('');
  const [travelSpots, setTravelSpots] = useAtom(travelSpotsAtom);
  const router = useRouter();

  const fetchTravelSpots = async () => {
    const res = await apiClient.travelStartingSpot.$post({
      body: { destination: userDestination },
    });
    setTravelSpots(res);
    router.push('/travelSpotList');
  };

  //カテゴリー選択

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>
          TravelDestination
          <br />
        </h1>
        {/* ここになにかしらのアイコン画像を入れいる */}
        <img src={imageUrl} alt="Google Image" className={styles.image} />

        <div className={styles.searchBox}>
          <p>行きたい場所を入力してください</p>
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
        </div>

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
    </div>
  );
};
export default TravelDestination;
