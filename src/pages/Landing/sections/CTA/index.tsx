import { useNavigate } from "react-router";
import { Gamepad2 } from "lucide-react";
import styles from "./styles.module.css";

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaOverlay} />
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>
          Pronto para essa aventura?
        </h2>
        <p className={styles.ctaDesc}>
          Junte-se a nossa turma e descubra todos os segredos da escola!
        </p>
        <button className={styles.ctaButtonBig} onClick={() => navigate("/")}>
          <Gamepad2 size={28} />
          Jogar Agora
        </button>
      </div>
    </section>
  );
}
