import type { TravelSpot } from 'common/types/travelSpots';
import type React from 'react';
import styles from './SelectedTravelSpots.module.css';

type SelectedTravelSpotsProps = {
  selectedSpots: TravelSpot[];
  setTravelSpots: React.Dispatch<React.SetStateAction<TravelSpot[]>>;
};

const SelectedTravelSpots: React.FC<SelectedTravelSpotsProps> = ({
  selectedSpots,
  setTravelSpots,
}) => {
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSelectedSpots = [...selectedSpots];
    [newSelectedSpots[index - 1].index, newSelectedSpots[index].index] = [
      newSelectedSpots[index].index,
      newSelectedSpots[index - 1].index,
    ];
    updateTravelSpots(newSelectedSpots);
  };

  const moveDown = (index: number) => {
    if (index === selectedSpots.length - 1) return;
    const newSelectedSpots = [...selectedSpots];
    [newSelectedSpots[index + 1].index, newSelectedSpots[index].index] = [
      newSelectedSpots[index].index,
      newSelectedSpots[index + 1].index,
    ];
    updateTravelSpots(newSelectedSpots);
  };

  const updateTravelSpots = (newSelectedSpots: TravelSpot[]) => {
    setTravelSpots((prevTravelSpots) =>
      prevTravelSpots.map(
        (spot) => newSelectedSpots.find((selectedSpot) => selectedSpot.name === spot.name) || spot,
      ),
    );
  };

  const handleReset = () => {
    setTravelSpots((prevTravelSpots) =>
      prevTravelSpots.map((spot) => ({ ...spot, isSelected: false, index: null })),
    );
  };

  return (
    <div>
      <h2>選択されたスポット</h2>
      <ul>
        {selectedSpots
          .sort((a, b) => (a.index !== null && b.index !== null ? a.index - b.index : 0))
          .map((spot, index) => (
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
      <button onClick={handleReset}>リセット</button>
    </div>
  );
};

export default SelectedTravelSpots;
