import { useAtom } from 'jotai';
import styles from 'pages/travelSpotList/index.module.css';
import { travelSpotsAtom } from 'utils/travelSpotsAtom';

const TravelSpotList = () => {
  const [travelSpots] = useAtom(travelSpotsAtom);
  return (
    <div>
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

export default TravelSpotList;
