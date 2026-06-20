import { BookOpen } from "lucide-react";
import shared from "../../styles.module.css";
import styles from "./styles.module.css";

export function About() {
  return (
    <section className={shared.section}>
      <div className={shared.sectionInner}>
        <h2 className={shared.sectionTitle}>
          <BookOpen size={28} />
          Sobre o Jogo
        </h2>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutCard}>
            <h3>O que é Jomásio Adventures?</h3>
            <p>
              Jomásio Adventures é um RPG 2D em tile-based grid que se
              passa nos corredores do Instituto Federal. Explore salas,
              enfrente bosses lendários, complete quests e descubra os
              segredos escondidos em cada canto da escola.
            </p>
          </div>
          <div className={styles.aboutCard}>
            <h3>Inspiração e Estilo</h3>
            <p>
              Inspirado em clássicos RPGs e na cultura da internet
              brasileira, o jogo mistura humor, referências e uma
              gameplay viciante com combates em turnos, sistema de
              classes e muito mais.
            </p>
          </div>
          <div className={styles.aboutCard}>
            <h3>Multiplayer</h3>
            <p>
              Crie sua conta, salve seu progresso na nuvem e
              compita com seus amigos para ver quem consegue derrotar
              todos os bosses primeiro!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
