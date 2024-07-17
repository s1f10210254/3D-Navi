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
        'フルーツ狩り',
      ],
    };
    if (category === '') {
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
      <div className={styles.box}>
        <div className={styles.subject}>カテゴリ</div>
        <select className={styles.sel} onChange={(e) => selectCategory(e.target.value)}>
          <option>すべて</option>
          <option>観光・遊ぶ</option>
          <option>ショッピング</option>
          <option>グルメ・レストラン</option>
        </select>
      </div>

      <input value={userDestination} onChange={(e) => setUserDestination(e.target.value)} />
      <button onClick={fetchTravelSpots} className={styles.serch}>
        検索
      </button>
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
