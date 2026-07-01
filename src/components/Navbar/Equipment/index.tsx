import styles from "./styles.module.css";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";

export function Equipment() {
  return (
    <div className="containerOfNavbar">
      <div className={styles.layout}>
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}
