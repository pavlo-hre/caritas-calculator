import styles from "./App.module.css";
import ServiceCalculator from "./components/ServiceCalculator";

function App() {
  return (
    <div className={styles.appWrapper}>
      <ServiceCalculator />
    </div>
  );
}

export default App;
