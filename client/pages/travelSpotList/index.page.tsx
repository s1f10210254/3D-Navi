import type { TravelSpot } from 'common/types/travelSpots';
import { Header } from 'components/header/Header';
import SelectedTravelSpots from 'components/selectedTravelSpots/SelectedTravelSpots';
import { useAtom } from 'jotai';
import styles from 'pages/travelSpotList/index.module.css';
import { useState } from 'react';
import { getSelectedTravelSpots } from 'utils/selectedTravelSpots';
import { isMobileAtom, travelSpotsAtom } from 'utils/travelSpotsAtom';
const TravelSpotList = () => {
  const [travelSpots, setTravelSpots] = useAtom<TravelSpot[]>(travelSpotsAtom);
  const selectedSpots = getSelectedTravelSpots(travelSpots);
  const [isMobile] = useAtom(isMobileAtom);
  const [showMore, setShowMore] = useState(Array(travelSpots.length).fill(false));

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

  const handleShowMore = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // イベントの伝播を停止
    setShowMore((prevShowMore) => {
      const newShowMore = [...prevShowMore];
      newShowMore[index] = !newShowMore[index];
      return newShowMore;
    });
  };

  const renderImage = (spot: TravelSpot) => {
    return (
      <div className={styles.imagesBox}>
        {spot.photoUrl ? (
          <img src={spot.photoUrl} alt={spot.name} className={styles.images} />
        ) : (
          <p>写真なし</p>
        )}
      </div>
    );
  };

  const renderDescriptionText = (spot: TravelSpot, index: number) => {
    const maxLength = 50;
    return showMore[index] ? spot.description : `${spot.description.substring(0, maxLength)}...`;
  };

  const renderMoreButton = (spot: TravelSpot, index: number) => {
    const isLongDescription = spot.description && spot.description.length > 50;
    return (
      isLongDescription && (
        <button className={styles.moreButton} onClick={(e) => handleShowMore(index, e)}>
          {showMore[index] ? '閉じる' : 'もっと見る'}
        </button>
      )
    );
  };
  const renderDescription = (spot: TravelSpot, index: number) =>
    spot.description ? (
      <>
        <p className={styles.listDescription}>{renderDescriptionText(spot, index)}</p>
        {renderMoreButton(spot, index)}
      </>
    ) : (
      <p className={styles.listDescription}>概要なし</p>
    );

  const renderCategory = (spot: TravelSpot, index: number) =>
    (spot.description && showMore[index]) || !spot.description ? (
      <p className={styles.listCategory}>カテゴリ: {spot.categories}</p>
    ) : null;

  const renderMobileSpotItem = (spot: TravelSpot, index: number) => {
    return (
      <>
        <h3 className={styles.listTitle}>{spot.name}</h3>
        {renderImage(spot)}
        {renderDescription(spot, index)}
        {renderCategory(spot, index)}
      </>
    );
  };

  const renderPCSpotItem = (spot: TravelSpot) => {
    return (
      <>
        <h3 className={styles.listTitle}>{spot.name}</h3>
        {renderImage(spot)}
        <p className={styles.listDescription}>{spot.description}</p>
        <p className={styles.listCategory}>カテゴリ:{spot.categories}</p>
      </>
    );
  };

  const renderSpotItem = (spot: TravelSpot, index: number) => (
    <li
      key={index}
      className={`${styles.listItem} ${spot.isSelected ? styles.selected : ''}`}
      onClick={() => handleItemClick(index)}
    >
      <>
        {isMobile ? <div>{renderMobileSpotItem(spot, index)}</div> : <>{renderPCSpotItem(spot)}</>}
      </>
    </li>
  );

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <SelectedTravelSpots selectedSpots={selectedSpots} setTravelSpots={setTravelSpots} />

        <div className={styles.listContainer}>
          <h3 className={styles.heading}>行き先を選んでください</h3>

          <ul className={styles.list}>
            {travelSpots.map((spot, index) => renderSpotItem(spot, index))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TravelSpotList;
