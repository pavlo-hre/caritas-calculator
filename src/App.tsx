import styles from "./App.module.css";
import ServiceCalculator from "./components/ServiceCalculator";
import Header from './components/Header.tsx';

function App() {
  return (
    <div className={styles.appWrapper}>
      <Header/>
      <ServiceCalculator />
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Caritas Zaporizhzhia
      </footer>
    </div>
  );
}

export default App;
