import styles from './ContactSection.module.css';
import { PhoneIcon } from '../icons/PhoneIcon.tsx';

// Standalone page only — rendered from App.tsx, never imported by the WordPress entry (src/wp.tsx).
const PHONES = [
  { label: '067 801 88 96', href: 'tel:+380678018896' },
];

export default function ContactSection() {
  return (
    <section className={styles.contact} aria-labelledby="cz-contact-title">
      <h2 id="cz-contact-title" className={styles.title}>
        Як оформити послугу догляду вдома від БО “БФ “Карітас Запоріжжя”?
      </h2>
      <div className={styles.card}>
        <span className={styles.icon}>
          <PhoneIcon />
        </span>
        <div className={styles.body}>
          <p className={styles.text}>
            Звернутися до фонду Ви можете особисто або через законного представника за номером:
          </p>
          <div className={styles.phones}>
            {PHONES.map((phone) => (
              <a key={phone.href} className={styles.phone} href={phone.href}>
                {phone.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
