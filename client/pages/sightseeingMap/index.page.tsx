import { useState } from 'react';
import styles from './index.module.css';

const SightseeingMap = () => {
  const [selectedPlace, setSelectedPlace] = useState<string[]>([]);

  const handleSelectPlace = (place: string) => {
    if (selectedPlace.includes(place)) {
      setSelectedPlace(selectedPlace.filter((p) => p !== place));
      return;
    }
    setSelectedPlace([...selectedPlace, place]);
  };

  const onClickDecide = () => {
    if (selectedPlace.length === 0) {
      alert('行き先を選択してください');
      return;
    }
    //ここにpost処理を書く
    alert(`行き先は${selectedPlace.join('、')}です`);
  };

  return (
    <div>
      <h1>観光地マップ</h1>
      <div className={styles.buttonWrapper}>
        <button
          onClick={() => handleSelectPlace('金閣寺')}
          style={{
            backgroundColor: selectedPlace.includes('金閣寺') ? 'red' : 'white',
          }}
        >
          金閣寺
        </button>
        <button
          onClick={() => handleSelectPlace('清水寺')}
          style={{
            backgroundColor: selectedPlace.includes('清水寺') ? 'red' : 'white',
          }}
        >
          清水寺
        </button>
        <button
          onClick={() => handleSelectPlace('伏見稲荷大社')}
          style={{
            backgroundColor: selectedPlace.includes('伏見稲荷大社') ? 'red' : 'white',
          }}
        >
          伏見稲荷大社
        </button>
      </div>
      <button onClick={onClickDecide}>行き先決定</button>
    </div>
  );
};

export default SightseeingMap;
