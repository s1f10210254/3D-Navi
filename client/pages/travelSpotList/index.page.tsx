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

  // const handleCheckboxChange = (index: number) => {
  //   setTravelSpots((prevTravelSpots) =>
  //     prevTravelSpots.map((spot, i) =>
  //       i === index
  //         ? {
  //             ...spot,
  //             isSelected: !spot.isSelected,
  //             index: !spot.isSelected ? prevTravelSpots.filter((s) => s.isSelected).length : null,
  //           }
  //         : spot,
  //     ),
  //   );
  // };

  const handleItemClick = (index: number) => {
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
  const truncateDescription = (description: string) => {
    const maxLength = window.innerWidth <= 800 ? 50 : 800;
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <SelectedTravelSpots selectedSpots={selectedSpots} setTravelSpots={setTravelSpots} />

        <div className={styles.listContainer}>
          <h1>TravelSpotList</h1>

          <ul className={styles.list}>
            {travelSpots.map((spot, index) => (
              // <li key={index} className={styles.listItem}>
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
                {/* <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(index)}
                    checked={spot.isSelected}
                  /> */}
                <h2 className={styles.listTitle}>{spot.name}</h2>
                <p className={styles.listDescription}>{truncateDescription(spot.description)}</p>
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
