import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { CHARACTERS } from "@/data/options/characters";

export function Status() {
  const { player, playerClass } = usePlayer();
  const { progress, addStat, getXPToNextLevel } = useCharacterProgress();

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

  return (
    <div className={styles.container}>
      <h2>Status</h2>

      <div className={styles.flexRow}>
        <div className={styles.flexColumn}>
          <img src={`/src/assets/player/${player.character}/default.svg`} />
          <h2>{characterData?.name} - Nv.{charProgress.level}</h2>
          <h2>Classe: {playerClass}</h2>
          <div className={styles.xpBar}>
            <div
              className={styles.xpFill}
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
          <p>Vida: {stats.hp}</p>
          <button onClick={() => addStat(player.character, "hp")}>+</button>

          <p>Força: {stats.strength}</p>
          <button onClick={() => addStat(player.character, "strength")}>+</button>

          <p>Inteligência: {stats.intelligence}</p>
          <button onClick={() => addStat(player.character, "intelligence")}>+</button>

          <p>Pontos disponíveis: {stats.points}</p>
        </div>
      </div>
    </div>
  );
}