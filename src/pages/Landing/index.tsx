import { useNavigate } from "react-router";
import { asset } from "@/utils/asset";
import {
  ChevronDown,
  Sword,
  MapPin,
  Users,
  Gamepad2,
  BookOpen,
  Sparkles,
  ScrollText,
  Shield,
  Zap,
} from "lucide-react";
import styles from "./styles.module.css";

const locations = [
  { name: "Hall", image: asset("/assets/cenarios/jomasio/hall/one.svg") },
  { name: "Cantina", image: asset("/assets/cenarios/cantina.svg") },
  { name: "Biblioteca", image: asset("/assets/cenarios/library.svg") },
  { name: "Sala dos PCs", image: asset("/assets/cenarios/pcsRoom.svg") },
  { name: "Quadra", image: asset("/assets/cenarios/footballCourt.svg") },
  { name: "Cafeteria", image: asset("/assets/cenarios/cafeteria.svg") },
];

const bosses = [
  { name: "Jailson", image: asset("/assets/npcs/jailson/default.svg"), desc: "O rei da delícia" },
  { name: "Irmãs Planetárias", image: asset("/assets/npcs/planetarySisters/mary.svg"), desc: "Guardiãs do centro" },
  { name: "Maurão", image: asset("/assets/npcs/maurao/default.svg"), desc: "A fera do pandemônio" },
  { name: "Vandinha", image: asset("/assets/npcs/vandinhaFragment/default.svg"), desc: "Fragmento sombrio" },
  { name: "JhowSimar", image: asset("/assets/npcs/jhowsimar/default.svg"), desc: "O lendário porteiro" },
  { name: "Hungry King", image: asset("/assets/npcs/hungryKing/default.svg"), desc: "Rei da fome" },
  { name: "Juan Derson", image: asset("/assets/npcs/janderson/right.svg"), desc: "Professor do café" },
  { name: "Bode", image: asset("/assets/npcs/goat/default.svg"), desc: "Cardápio principal" },
];

const characters = [
  { name: "Marcelo", image: asset("/assets/player/marcelo/default.svg"), class: "Espadachim" },
  { name: "Artur", image: asset("/assets/player/artur/default.svg"), class: "Explosivo" },
  { name: "Eduarda", image: asset("/assets/player/eduarda/default.svg"), class: "Inquisidora" },
  { name: "Riquelme", image: asset("/assets/player/riquelme/default.svg"), class: "Tanque" },
  { name: "Emanuel", image: asset("/assets/player/emanuel/default.svg"), class: "Atacante" },
  { name: "Lucas", image: asset("/assets/player/lucas/default.svg"), class: "Boxeador" },
  { name: "Lucauã", image: asset("/assets/player/lucaua/default.svg"), class: "Versátil" },
  { name: "Larissa", image: asset("/assets/player/larissa/default.svg"), class: "Atiradora" },
  { name: "Camilly", image: asset("/assets/player/camilly/default.svg"), class: "Lutadora" },
  // { name: "Hiago", image: asset("/assets/player/hiago/default.svg"), class: "Tático" },
  { name: "Samuel", image: asset("/assets/player/samuel/default.svg"), class: "Berserker" },
  { name: "Mayra", image: asset("/assets/player/mayra/default.svg"), class: "DPS" },
];

const funnyMoments = [
  {
    title: "O Peru",
    desc: "Tu num é nem gente Peru! Glu Glu Glu",
    image: asset("/assets/items/peru.svg"),
  },
  {
    title: "Deliciômetro",
    desc: "Meça o nível de delícia da sua gameplay com este medidor sagrado.",
    image: asset("/assets/deliciometro.svg"),
  },
  {
    title: "Morto de Fome",
    desc: "É duas fungada e a comida se acaba, é duas pedalada e a corrente cai.",
    image: asset("/assets/npcs/hungryDeath/face.svg"),
  },
  {
    title: "Leite Suspeito",
    desc: "Achou um leite na cantina? Melhor pensar duas vezes antes de beber.",
    image: asset("/assets/items/suspect_milk.svg"),
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <img
            src={asset("/assets/logo.svg")}
            alt="Jomasio Adventures"
            className={styles.logo}
          />
          <p className={styles.subtitle}>
            Um RPG de aventura pelos corredores do Jomásio, cheio de bosses,
            amigos e momentos inesquecíveis
          </p>
          <button
            className={styles.ctaButton}
            onClick={() => navigate("/")}
          >
            <Gamepad2 size={24} />
            Começar Aventura
          </button>
          <div className={styles.scrollIndicator}>
            <span>Role para conhecer mais</span>
            <ChevronDown size={24} className={styles.bounce} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
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

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
            <MapPin size={28} />
            Explore o Mundo
          </h2>
          <p className={styles.sectionDesc}>
            Cada sala da escola esconde segredos, NPCs e desafios únicos
          </p>
          <div className={styles.locationsGrid}>
            {locations.map((loc) => (
              <div key={loc.name} className={styles.locationCard}>
                <img
                  src={loc.image}
                  alt={loc.name}
                  className={styles.locationImage}
                />
                <span className={styles.locationName}>{loc.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
            <Sword size={28} />
            Sistema de Combate
          </h2>
          <div className={styles.combatGrid}>
            <div className={styles.combatCard}>
              <Zap size={32} className={styles.combatIcon} />
              <h3>Combate em Turnos</h3>
              <p>
                Batalhe contra NPCs em combates turno-based com ataques,
                esquivas, bloqueios e habilidades especiais.
              </p>
            </div>
            <div className={styles.combatCard}>
              <Shield size={32} className={styles.combatIcon} />
              <h3>Classes Únicas</h3>
              <p>
                Cada personagem possui uma classe com habilidades
                próprias. Escolha a que melhor se adapta ao seu estilo!
              </p>
            </div>
            <div className={styles.combatCard}>
              <Sparkles size={32} className={styles.combatIcon} />
              <h3>Itens e Equipamentos</h3>
              <p>
                Colete itens espalhados pelo mapa, equipe armamentos e
                use poções para virar o jogo nas batalhas.
              </p>
            </div>
            <div className={styles.combatCard}>
              <ScrollText size={32} className={styles.combatIcon} />
              <h3>Missões e Quests</h3>
              <p>
                Receba quests dos NPCs, complete objetivos e ganhe
                recompensas exclusivas.
              </p>
            </div>
          </div>
          <div className={styles.bossesSection}>
            <h3 className={styles.bossesTitle}>Bosses para enfrentar</h3>
            <div className={styles.bossesGrid}>
              {bosses.map((boss) => (
                <div key={boss.name} className={styles.bossCard}>
                  <img
                    src={boss.image}
                    alt={boss.name}
                    className={styles.bossImage}
                  />
                  <strong>{boss.name}</strong>
                  <span className={styles.bossDesc}>{boss.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
            <Users size={28} />
            Personagens Jogáveis
          </h2>
          <p className={styles.sectionDesc}>
            Escolha entre 12 personagens, cada um com sua própria classe e
            estilo de luta
          </p>
          <div className={styles.charactersGrid}>
            {characters.map((char) => (
              <div key={char.name} className={styles.characterCard}>
                <img
                  src={char.image}
                  alt={char.name}
                  className={styles.characterImage}
                />
                <strong>{char.name}</strong>
                <span className={styles.characterClass}>{char.class}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
            <Sparkles size={28} />
            Momentos Inesquecíveis
          </h2>
          <p className={styles.sectionDesc}>
            O jogo é repleto de referências e situações hilárias que todo
            aluno do Jomásio vai reconhecer
          </p>
          <div className={styles.funnyGrid}>
            {funnyMoments.map((moment) => (
              <div key={moment.title} className={styles.funnyCard}>
                <img src={moment.image} alt={moment.title} className={styles.funnyImage} />
                <h3>{moment.title}</h3>
                <p>{moment.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
            <Gamepad2 size={28} />
            Como Jogar
          </h2>
          <div className={styles.howtoGrid}>
            <div className={styles.howtoStep}>
              <span className={styles.stepNumber}>1</span>
              <div>
                <h3>Crie sua conta</h3>
                <p>
                  Registre-se para salvar seu progresso e competir com
                  amigos.
                </p>
              </div>
            </div>
            <div className={styles.howtoStep}>
              <span className={styles.stepNumber}>2</span>
              <div>
                <h3>Escolha seu personagem</h3>
                <p>
                  Selecione entre 12 personagens com classes e
                  habilidades únicas.
                </p>
              </div>
            </div>
            <div className={styles.howtoStep}>
              <span className={styles.stepNumber}>3</span>
              <div>
                <h3>Explore e complete quests</h3>
                <p>
                  Ande pelos cenários, converse com NPCs e aceite
                  missões.
                </p>
              </div>
            </div>
            <div className={styles.howtoStep}>
              <span className={styles.stepNumber}>4</span>
              <div>
                <h3>Derrote os bosses</h3>
                <p>
                  Encare desafios cada vez mais difíceis e prove seu
                  valor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaOverlay} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Pronto para essa aventura?
          </h2>
          <p className={styles.ctaDesc}>
            Junte-se a Jomásio e descubra todos os segredos da escola!
          </p>
          <button
            className={styles.ctaButtonBig}
            onClick={() => navigate("/")}
          >
            <Gamepad2 size={28} />
            Jogar Agora
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Jomásio Adventures &copy; {new Date().getFullYear()}</p>
        <p className={styles.footerSmall}>
          Feito pelo desenvolvedor Marcelo Benjamin, com carinho e lembranças.
        </p>
      </footer>
    </div>
  );
}
