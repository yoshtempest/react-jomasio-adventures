import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";

export function Status() {
  const { player } = usePlayer();
  const { progress, addStat } = useCharacterProgress();

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

  return (
    <div className={styles.container}>
      <h2>Status</h2>

      <p>Vida: {stats.hp}</p>
      <button onClick={() => addStat(player.character, "hp")}>+</button>

      <p>Força: {stats.strength}</p>
      <button onClick={() => addStat(player.character, "strength")}>+</button>

      <p>Inteligência: {stats.intelligence}</p>
      <button onClick={() => addStat(player.character, "intelligence")}>+</button>

      <p>Pontos disponíveis: {stats.points}</p>

      <hr />

      <p>HP total: {userHp}</p>
      <p>Dano normal: {userNormalAttackDamage}</p>
      <p>Dano especial: {userSpecialDamage}</p>
    </div>
  );
}