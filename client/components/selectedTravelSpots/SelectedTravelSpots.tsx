import type { TravelSpot } from 'common/types/travelSpots';
import type React from 'react';
import styles from './SelectedTravelSpots.module.css';

type SelectedTravelSpotsProps = {
  selectedSpots: TravelSpot[];
  setSelectedSpots: React.Dispatch<React.SetStateAction<TravelSpot[]>>;
};
const SelectedTravelSpots: React.FC<SelectedTravelSpotsProps> = ({
  selectedSpots,
  setSelectedSpots,
}) => {
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSpots = [...selectedSpots];
    [newSpots[index - 1], newSpots[index]] = [newSpots[index], newSpots[index - 1]];
    setSelectedSpots(newSpots);
  };

  const moveDown = (index: number) => {
    if (index === selectedSpots.length - 1) return;
    const newSpots = [...selectedSpots];
    [newSpots[index + 1], newSpots[index]] = [newSpots[index], newSpots[index + 1]];
    setSelectedSpots(newSpots);
  };

  return (
    <div>
      <h2>選択されたスポット</h2>
      <ul>
        {selectedSpots.map((spot, index) => (
          <li key={index} className={styles.listItem}>
            <p className={styles.listTitle}>
              {index + 1}.{spot.name}
            </p>
            <div className={styles.buttonGroup}>
              <button className={styles.moveButton} onClick={() => moveUp(index)}>
                上へ
              </button>
              <button className={styles.moveButton} onClick={() => moveDown(index)}>
                下へ
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedTravelSpots;
