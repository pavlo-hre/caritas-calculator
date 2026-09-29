import styles from "./App.module.css";
import ServiceCalculator from "./components/ServiceCalculator";

function App() {
  return (
    <main className={styles.appWrapper}>
      <ServiceCalculator />
    </main>
  );
}

export default App;
