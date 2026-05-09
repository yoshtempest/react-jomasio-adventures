import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { CHARACTERS } from "@/data/options/characters";
import { useStatusMenu } from "@/hooks/menu/useStatusMenu";
import { asset } from "@/utils/asset";

export function Status() {
  const { player, playerClass } = usePlayer();
  const { progress, getXPToNextLevel } = useCharacterProgress();

  const char = progress[player.character] ?? {
      level: 1,
      xp: 0,
      stats: {
          hp: 1,
          strength: 1,
          intelligence: 1,
          points: 0,
      },
  };

  const stats = char.stats;

  const userHp = 90 + stats.hp * 10;
  const userSpecialDamage = 15 + stats.intelligence * 2;
  const userNormalAttackDamage = 6 + stats.strength;

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const percent = (charProgress.xp / xpNeeded) * 100;
  const characterData = CHARACTERS.find(
    (c) => c.image === player.character
  );
  const { selectedIndex } = useStatusMenu(true);

  return (
    <div className="containerOfNavbar">
      <h2>Status</h2>

      <div className={styles.flexRow}>
        <div className={styles.flexColumn}>
          <img src={asset(`/assets/player/${player.character}/default.svg`)} className={styles.image} />
          <h2>{characterData?.name} - Nv.{charProgress.level}</h2>
          <h2>Classe: {playerClass}</h2>
          <div className="xpBar">
            <div
              className="xpFill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className={styles.oneLine}>
            <p>HP total: {userHp}</p>
            <p>Dano normal: {userNormalAttackDamage}</p>
            <p>Dano especial: {userSpecialDamage}</p>
          </div>
        </div>

        <div className={styles.flexColumn}>
          <div className={selectedIndex === 0 ? "active" : ""}>
            <p>Vida: {stats.hp}</p>
          </div>

          <div className={selectedIndex === 1 ? "active" : ""}>
            <p>Força: {stats.strength}</p>
          </div>

          <div className={selectedIndex === 2 ? "active" : ""}>
            <p>Inteligência: {stats.intelligence}</p>
          </div>

          <p>Pontos disponíveis: {stats.points}</p>

          {stats.points <= 0 && <p>Sem pontos disponíveis</p>}
        </div>
      </div>
    </div>
  );
}