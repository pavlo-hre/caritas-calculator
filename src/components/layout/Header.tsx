import styles from './Header.module.css';
import logo from '../../assets/caritas-logo.webp';
import { PhoneIcon } from '../icons/PhoneIcon.tsx';
import { FacebookIcon, InstagramIcon, TelegramIcon } from '../icons/SocialIcons.tsx';

// Standalone page only — rendered from App.tsx, never imported by the WordPress entry (src/wp.tsx).
const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/caritas.zp/', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/caritas.zp/', Icon: InstagramIcon },
  { label: 'Telegram', href: 'https://t.me/caritas_zp', Icon: TelegramIcon },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.logo} href="https://zp.caritas.ua/">
          <img src={logo} width="589" height="187" alt="Карітас Запоріжжя" />
        </a>

        <a className={styles.hotline} href="tel:+380800336734">
          <span className={styles.hotlineIcon}>
            <PhoneIcon />
          </span>
          <span className={styles.hotlineLabel}>Інформаційна лінія</span>
          <span className={styles.hotlineNum}>0800 336 734</span>
        </a>

        <nav className={styles.socials} aria-label="Соцмережі">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a key={label} className={styles.social} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
