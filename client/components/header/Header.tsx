import { APP_NAME } from 'common/constants';
import { useRouter } from 'next/router';
import { pagesPath, staticPath } from 'utils/$path';
import styles from './header.module.css';
export const Header = () => {
  const router = useRouter();
  const backHome = () => {
    router.push(pagesPath.$url());
  };
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.appName} onClick={backHome}>
          {APP_NAME}
        </div>
        <div className={styles.logo}>
          <a
            href="https://github.com/imoken777/hackathon-vol9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={staticPath.images.github_logo_icon_icons_webp}
              alt="logo"
              className={styles.logoItem}
            />
          </a>
        </div>
      </div>
    </div>
  );
};
