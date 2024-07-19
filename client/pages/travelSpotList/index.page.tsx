import type { TravelSpot } from 'common/types/travelSpots';
import SelectedTravelSpots from 'components/selectedTravelSpots/SelectedTravelSpots';
import { useAtom } from 'jotai';
import styles from 'pages/travelSpotList/index.module.css';
import { getSelectedTravelSpots } from 'utils/selectedTravelSpots';
import { travelSpotsAtom } from 'utils/travelSpotsAtom';

const TravelSpotList = () => {
  const [travelSpots, setTravelSpots] = useAtom<TravelSpot[]>(travelSpotsAtom);
  const selectedSpots = getSelectedTravelSpots(travelSpots);

  const handleCheckboxChange = (index: number) => {
    setTravelSpots((prevTravelSpots) =>
      prevTravelSpots.map((spot, i) =>
        i === index
          ? {
              ...spot,
              isSelected: !spot.isSelected,
              index: !spot.isSelected ? prevTravelSpots.filter((s) => s.isSelected).length : null,
            }
          : spot,
      ),
    );
  };

  return (
    <div className={styles.container}>
      <SelectedTravelSpots selectedSpots={selectedSpots} setTravelSpots={setTravelSpots} />

      <div className={styles.listContainer}>
        <h1>TravelSpotList</h1>
        <ul className={styles.list}>
          {travelSpots.map((spot, index) => (
            <li key={index} className={styles.listItem}>
              <div className={styles.itemHeader}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(index)}
                  checked={spot.isSelected}
                />
                <h2 className={styles.listTitle}>{spot.name}</h2>
              </div>
              <p className={styles.listDescription}>{spot.description}</p>
              {spot.photoUrl ? (
                <img
                  src={spot.photoUrl}
                  alt={spot.name}
                  style={{ maxHeight: '100px', maxWidth: '200px' }}
                />
              ) : (
                <p>写真なし</p>
              )}
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
