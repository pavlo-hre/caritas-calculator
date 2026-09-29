import clsx from "clsx";
import styles from "./App.module.css";
import ServiceCalculator from "./components/ServiceCalculator";

function App() {
  return (
    <main className={clsx("cz-calc", styles.appWrapper)}>
      <ServiceCalculator />
    </main>
  );
}

export default App;
