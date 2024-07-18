import type { TravelSpot } from 'common/types/travelSpots';
import SelectedTravelSpots from 'components/selectedTravelSpots/SelectedTravelSpots';
import { useAtom } from 'jotai';
import styles from 'pages/travelSpotList/index.module.css';
import { useState } from 'react';
import { travelSpotsAtom } from 'utils/travelSpotsAtom';

const TravelSpotList = () => {
  const [travelSpots] = useAtom<TravelSpot[]>(travelSpotsAtom);
  const [selectedSpots, setSelectedSpots] = useState<number[]>([]);
  const [confirmedSpots, setConfirmedSpots] = useState<TravelSpot[]>([]);

  const handleCheckboxChange = (index: number) => {
    setSelectedSpots((prevSelectedSpots) => {
      if (prevSelectedSpots.includes(index)) {
        return prevSelectedSpots.filter((i) => i !== index);
      } else {
        return [...prevSelectedSpots, index];
      }
    });
  };

  const handleDecision = () => {
    const selectedTravelSpots = travelSpots.filter((_, index) => selectedSpots.includes(index));
    setConfirmedSpots(selectedTravelSpots);
  };

  const handleReset = () => {
    setSelectedSpots([]);
    setConfirmedSpots([]);
  };

  return (
    <div className={styles.container}>
      {confirmedSpots.length > 0 ? (
        <SelectedTravelSpots selectedSpots={confirmedSpots} setSelectedSpots={setConfirmedSpots} />
      ) : (
        <h2>選択されたスポット</h2>
      )}
      <div className={styles.listContainer}>
        <h1>TravelSpotList</h1>
        <div>
          <button onClick={handleDecision}>決定</button>
          <button onClick={handleReset}>リセット</button>
        </div>
        <ul className={styles.list}>
          {travelSpots.map((spot, index) => (
            <li key={index} className={styles.listItem}>
              <div className={styles.itemHeader}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(index)}
                  checked={selectedSpots.includes(index)}
                />
                <h2 className={styles.listTitle}>{spot.name}</h2>
              </div>
              <p className={styles.listDescription}>{spot.description}</p>
              <br />
              <p className={styles.listDescription}>カテゴリ：{spot.categories}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TravelSpotList;
