import { usePWA } from "@/contexts/PWAContext";
import styles from "./styles.module.css";

export default function InstallButton() {
  const { canInstall, install } = usePWA();
  if (!canInstall) return null;
  return (
    <button type="button" className={styles.button} onClick={install}>
      Instalar app
    </button>
  );
}
