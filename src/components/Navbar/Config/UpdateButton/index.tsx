import styles from "./styles.module.css";
import { RefreshCw } from "lucide-react";
import { useUpdate } from "@/contexts/UpdateContext";

export function UpdateButton() {
  const { status, checkForUpdate } = useUpdate();

  const label =
    status === "checking"
      ? "Verificando..."
      : status === "error"
        ? "Erro ao verificar"
        : "Verificar atualização";

  return (
    <button
      type="button"
      className={styles.tutorialButton}
      onClick={checkForUpdate}
      disabled={status === "checking"}
    >
      <RefreshCw
        size={14}
        className={status === "checking" ? styles.spinning : undefined}
      />
      {label}
    </button>
  );
}
