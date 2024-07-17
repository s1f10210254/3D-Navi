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
  };

  //カテゴリー選択
  const selectCategory = (category: string) => {
    const allCategories = {
      sighttseeng: [
        '温泉',
        'テーマパーク',
        '動物園・水族館',
        'キャンプ場',
        'ゴルフ場',
        'ビーチ',
        '美術館・博物館',
        '公園・植物園',
        '名所・史跡',
        '寺・神社・協会',
        '自然・景勝地',
        'スキー場',
        '紅葉',
        '花見',
        'イルミネーション',
        'フルーツ狩り・農業体験',
        '祭り・イベント',
        '世界遺産',
        '花火',
      ],
      shopping: [
        '専門店',
        '百貨店・デパート',
        'スーパー・コンビニ・量販店',
        'ショッピングモール',
        'アウトレット',
        '市場・商店街',
        'お土産屋・直売所・特産品',
      ],
      gourmet: ['グルメ・レストラン'],
    };
    if (category === '観光・遊ぶ') {
    }
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
      <div className={styles.searchBox}>
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
