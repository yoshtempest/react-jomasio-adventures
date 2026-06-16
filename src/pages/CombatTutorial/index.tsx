import { usePlayer } from "@/contexts/PlayerContext";
import { useGameLayout } from "@/hooks/useGameLayout";
import { useCombatTasks } from "@/hooks/tutorial/useCombatTasks";
import { useCombatTutorialSetup } from "@/hooks/tutorial/useCombatTutorialSetup";
import { GameMap } from "@/components/Game/GameMap";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import { NPCBattle } from "@/components/Game/Npc/Battle";
import { TASKS } from "@/gameRules/tutorial/combatTasks";
import styles from "./styles.module.css";

export default function CombatTutorial() {
  const { player } = usePlayer();
  const {
    TILE_SIZE,
    PLAYER_SIZE,
    offsetX,
    offsetY,
    MAP_COLS,
    MAP_ROWS,
    scaleX,
    scaleY,
  } = useGameLayout();

  useCombatTutorialSetup({ TILE_SIZE, scaleX, scaleY });

  const { instruction, getTaskStatus } = useCombatTasks();

  return (
    <div className={`Master CombatTutorial`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPCBattle
          x={700}
          y={670}
          TILE_SIZE={TILE_SIZE}
          npcType="dummy"
          state="idle"
          direction="left"
        />

        <PlayerBattle
          character={player.character}
          x={player.x}
          y={player.y}
          PLAYER_SIZE={PLAYER_SIZE}
          state={player.state}
          direction={player.battleDirection}
        />
      </GameMap>

      <div className={styles.overlay}>
        <div className={styles.taskBox}>
          <p className={styles.taskText}>{instruction.text}</p>
          <p className={styles.taskSub}>{instruction.sub}</p>
        </div>

        <div className={styles.steps}>
          {TASKS.map((t) => {
            const status = getTaskStatus(t);
            return (
              <div
                key={t}
                className={`${styles.dot} ${status === "done" ? styles.dotDone : ""} ${status === "active" ? styles.dotActive : ""}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
