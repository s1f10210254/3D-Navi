import type { TravelSpot } from 'common/types/travelSpots';
import { Header } from 'components/header/Header';
import SelectedTravelSpots from 'components/selectedTravelSpots/SelectedTravelSpots';
import { useAtom } from 'jotai';
import styles from 'pages/travelSpotList/index.module.css';
import { getSelectedTravelSpots } from 'utils/selectedTravelSpots';
import { travelSpotsAtom } from 'utils/travelSpotsAtom';
const TravelSpotList = () => {
  const [travelSpots, setTravelSpots] = useAtom<TravelSpot[]>(travelSpotsAtom);
  const selectedSpots = getSelectedTravelSpots(travelSpots);

  const handleItemClick = (index: number) => {
    setTravelSpots((prevTravelSpots) => {
      const updatedSpots = prevTravelSpots.map((spot, i) =>
        i === index
          ? {
              ...spot,
              isSelected: !spot.isSelected,
              index: !spot.isSelected ? prevTravelSpots.filter((s) => s.isSelected).length : null,
            }
          : spot,
      );

      // インデックスが null の場合に再計算
      const selectedSpots = updatedSpots.filter((spot) => spot.isSelected);
      selectedSpots.forEach((spot, idx) => {
        spot.index = idx;
      });

      return updatedSpots;
    });
  };
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <SelectedTravelSpots selectedSpots={selectedSpots} setTravelSpots={setTravelSpots} />

        <div className={styles.listContainer}>
          <h3 className={styles.heading}>行き先を選んでください</h3>

          <ul className={styles.list}>
            {travelSpots.map((spot, index) => (
              <li
                key={index}
                className={`${styles.listItem} ${spot.isSelected ? styles.selected : ''}`}
                onClick={() => handleItemClick(index)}
              >
                <div className={styles.imagesBox}>
                  {spot.photoUrl ? (
                    <img src={spot.photoUrl} alt={spot.name} className={styles.images} />
                  ) : (
                    <p>写真なし</p>
                  )}
                </div>
                <h2 className={styles.listTitle}>{spot.name}</h2>
                <p className={styles.listDescription}>{spot.description}</p>
                <p className={styles.listCategory}>カテゴリ：{spot.categories}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TravelSpotList;
