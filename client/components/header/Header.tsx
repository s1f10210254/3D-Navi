import { useRouter } from 'next/router';
import { staticPath } from 'utils/$path';
import styles from './header.module.css';
export const Header = () => {
  const router = useRouter();
  const backHome = () => {
    router.push('/');
  };
  return (
    <div className={styles.header}>
      <div onClick={backHome}>
        <div className={styles.appTitle}>Travel</div>
      </div>
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
