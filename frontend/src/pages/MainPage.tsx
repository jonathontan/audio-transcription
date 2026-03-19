import { useState } from "react";
import NavigationTab from "../components/NavigationTab";
import Upload from "../components/Upload";
import styles from "./MainPage.module.css";

function MainPage() {
  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <div className={styles.container}>
      <h1>Audio Transcription</h1>
      <div className={styles.tabNavigation}>
        <NavigationTab tabIndex={tabIndex} onChange={setTabIndex} />
      </div>
      <div className={styles.tabContent}>
        {tabIndex === 0 && <Upload />}
      </div>
    </div>
  );
}

export default MainPage;
