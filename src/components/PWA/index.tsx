import { usePWA } from "@/contexts/PWAContext";
import styles from "./styles.module.css";

export default function InstallButton() {
  const {
    showInstalledMessage,
    setShowInstalledMessage,
    showNotAvailableMessage,
    setShowNotAvailableMessage,
  } = usePWA();

  return (
    <>
      <span>Instalar app</span>
      {showInstalledMessage && (
        <div className="overlay" onClick={() => setShowInstalledMessage(false)}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <p>Você já tem o app Jomásio Adventures instalado.</p>
            <button
              type="button"
              className={styles.popupButton}
              onClick={() => setShowInstalledMessage(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showNotAvailableMessage && (
        <div className={styles.overlay} onClick={() => setShowNotAvailableMessage(false)}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <p>
              Use o menu do navegador (⋮ ou ↗) e selecione &quot;Instalar app&quot; ou
              &quot;Adicionar à tela inicial&quot;.
            </p>
            <button
              type="button"
              className={styles.popupButton}
              onClick={() => setShowNotAvailableMessage(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
