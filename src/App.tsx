import clsx from "clsx";
import styles from "./App.module.css";
import ServiceCalculator from "./components/ServiceCalculator";
import Header from "./components/layout/Header";
import ContactSection from "./components/layout/ContactSection";

function App() {
  return (
    <div className={clsx("cz-calc", styles.appWrapper)}>
      <Header />
      <main>
        <ServiceCalculator />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
