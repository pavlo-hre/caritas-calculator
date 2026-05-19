import styles from '../styles/Header.module.css';
import logo from '../assets/caritas-logo.png';
import { LocationIcon } from './icons/LocationIcon.tsx';
import { PhoneIcon } from './icons/PhoneIcon.tsx';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerBox}>
        <a href="https://zp.caritas.ua/"> <img src={logo} alt="Caritas Zaporizhzhia"/></a>
        <div className={styles.contactInfo}>
        <div>
            <LocationIcon/>
            <a href="https://share.google/sdcwVY7s8megnt6ED" target="_blank">Запоріжжя, вул. Семафорна, 8</a>
          </div>
          <div>
            <PhoneIcon/>
            <a href="tel:+380678018896">
              +38 067 801 88 96
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
