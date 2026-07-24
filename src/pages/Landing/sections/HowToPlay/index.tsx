import { Gamepad2 } from "lucide-react";
import shared from "../../styles.module.css";
import styles from "./styles.module.css";

export function HowToPlay() {
  return (
    <section className={`${shared.section} ${shared.darkSection}`}>
      <div className={shared.sectionInner}>
        <h2 className={shared.sectionTitle}>
          <Gamepad2 size={28} />
          Como Jogar
        </h2>
        <div className={styles.howtoGrid}>
          <div className={`${"landingCard"} ${styles.howtoStep}`}>
            <span className={styles.stepNumber}>1</span>
            <div>
              <h3>Crie sua conta</h3>
              <p>
                Registre-se para salvar seu progresso e competir com amigos.
              </p>
            </div>
          </div>
          <div className={`${"landingCard"} ${styles.howtoStep}`}>
            <span className={styles.stepNumber}>2</span>
            <div>
              <h3>Escolha seu personagem</h3>
              <p>
                Selecione entre 12 personagens com classes e habilidades únicas.
              </p>
            </div>
          </div>
          <div className={`${"landingCard"} ${styles.howtoStep}`}>
            <span className={styles.stepNumber}>3</span>
            <div>
              <h3>Explore e complete quests</h3>
              <p>Ande pelos cenários, converse com NPCs e aceite missões.</p>
            </div>
          </div>
          <div className={`${"landingCard"} ${styles.howtoStep}`}>
            <span className={styles.stepNumber}>4</span>
            <div>
              <h3>Derrote os bosses</h3>
              <p>Encare desafios cada vez mais difíceis e prove seu valor.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
