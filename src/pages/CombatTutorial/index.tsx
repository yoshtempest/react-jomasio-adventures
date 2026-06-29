import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useGameLayout } from "@/hooks/game/useGameLayout";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { useCombatTasks } from "@/hooks/tutorial/useCombatTasks";
import { useCombatTutorialSetup } from "@/hooks/tutorial/useCombatTutorialSetup";
import { useCutscene } from "@/hooks/interaction/useCutscene";
import Talking from "@/components/Talking";
import { combatTutorialDialogue } from "@/data/maps/combatTutorial/one";
import { GameMap } from "@/components/Game/Map/Game";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import { NPCBattle } from "@/components/Game/Npc/Battle";
import { HealthBar } from "@/components/Game/Battle/HUD/HealthBar";
import { Deliciometro } from "@/components/Game/Battle/HUD/Deliciometro";
import { TASKS } from "@/gameRules/tutorial/combatTasks";
import { gainSpecial } from "@/gameRules/battle/special";
import KickBack from "/assets/songs/KickBack.mp3";
import styles from "./styles.module.css";

const DUMMY_MAX_HP = 10000;
const HITS_TO_SPECIAL = 6;

export default function CombatTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const battleAudio = useGameAudio({ src: KickBack, loop: true, volume: 0.5 });
  const battleAudioRef = useRef(battleAudio);
  battleAudioRef.current = battleAudio;

  useEffect(() => {
    battleAudioRef.current.play();
    return () => battleAudioRef.current.stop();
  }, []);

  const cutscene = useCutscene({
    dialogue: combatTutorialDialogue,
    onFinish: () => setShowTutorial(true),
  });

  if (!showTutorial) {
    return (
      <div className="Master CombatTutorial">
        <Talking
          name={cutscene.dialogue.name}
          message={cutscene.dialogue.message}
          src={cutscene.dialogue.src}
        />
      </div>
    );
  }

  return (
    <div className="Master CombatTutorial">
      <CombatTutorialInner />
    </div>
  );
}

function CombatTutorialInner() {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
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

  const playerMaxHp = 90 + progress[player.character].stats.hp * 10;
  const [dummyHP, setDummyHP] = useState(DUMMY_MAX_HP);
  const [delicia, setDelicia] = useState(0);
  const prevStateRef = useRef(player.state);

  useEffect(() => {
    const prev = prevStateRef.current;
    if (prev === "preAttack" && player.state === "attack") {
      setDummyHP((h) => Math.max(0, h - 1));
      setDelicia((d) => gainSpecial(d, HITS_TO_SPECIAL));
    }
    prevStateRef.current = player.state;
  }, [player.state]);

  return (
    <>
      <div className={styles.hudTop}>
        <div className={styles.playerHud}>
          <span className={styles.hudLabel}>Jogador</span>
          <HealthBar hp={playerMaxHp} maxHp={playerMaxHp} />
          <Deliciometro delicia={delicia} hitsToSpecial={HITS_TO_SPECIAL} />
        </div>
        <div className={styles.dummyHud}>
          <span className={styles.hudLabel}>Boneco de Treino</span>
          <HealthBar hp={dummyHP} maxHp={DUMMY_MAX_HP} reversed />
        </div>
      </div>

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
          <img className={styles.image} src="public/assets/npcs/surica/default.svg"/>
          <p className={styles.taskText}>{instruction.text}</p>
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
    </>
  );
}
