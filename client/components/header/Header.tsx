import styles from './header.module.css';
import iconLogo from './img/github-logo_icon-icons.webp';

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
        <img src={iconLogo.src} className={styles.githubLogo} alt="logo" />
      </a>
    </div>
  );
};
