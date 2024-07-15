import styles from 'pages/travelDestination/index.module.css';
import { useState } from 'react';
import { apiClient } from 'utils/apiClient';

const TravelDestination = () => {
  const [destination, setDestination] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const imageUrl =
    'https://p.potaufeu.asahi.com/fc1b-p/picture/28293924/fd25573b6b20e3c27ec3ce123f3a2a5e_640px.jpg';
  const serch = async () => {
    console.log('destination', destination);
    await apiClient.travelStartingSpot.post({ body: { destination } }).then((res) => {
      console.log('res', res);
      setResponse(res.body);
    });
  };

  return (
    <div className={styles.container}>
      <h1 style={{ fontSize: '50px', textAlign: 'center', width: '600px', height: '200px' }}>
        TravelDestination
        <br />
      </h1>
      {/* ここになにかしらのアイコン画像を入れいる */}
      <img src={imageUrl} alt="Google Image" style={{ width: '300px', height: 'auto' }} />
      <p>行きたい場所を入力してください</p>
      {/* <div className={styles.box}>
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
      </div> */}
      <div className={styles.box}>
        <div className={styles.subject}>観光地</div>
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={styles.inp}
          placeholder="例:京都"
        />
      </div>
      <button onClick={serch} className={styles.serch}>
        検索
      </button>
      <p>{response}</p>
    </div>
  );
};
export default TravelDestination;
