import { staticPath } from 'utils/$path';
import styles from './header.module.css';
export const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.appTitle}>Travel</div>
      <a
        href="https://github.com/imoken777/hackathon-vol9"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.logo}
      >
        <img
          src={staticPath.images.github_logo_icon_icons_webp}
          className={styles.githubLogo}
          alt="logo"
        />
      </a>
    </div>
  );
};
