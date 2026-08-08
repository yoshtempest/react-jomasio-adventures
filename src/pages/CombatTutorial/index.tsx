import { useState } from "react";
import { useCombatTasks } from "@/hooks/tutorial/useCombatTasks";
import { useCutscene } from "@/hooks/interaction/useCutscene";
import { npcPath } from "@/utils/paths";
import Talking from "@/components/Talking";
import { BattleScene } from "@/components/Game/Scenes/Battle";
import { combatTutorialDialogue } from "@/data/dialogues/combatTutorial/one";
import { TASKS } from "@/gameRules/tutorial/combatTasks";
import KickBack from "/assets/songs/background/battle/KickBack.mp3";
import { sceneBackgrounds } from "@/data/scene/background";
import styles from "./styles.module.css";

export default function CombatTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);

  const cutscene = useCutscene({
    dialogue: combatTutorialDialogue,
    onFinish: () => setShowTutorial(true),
  });

  if (!showTutorial) {
    return (
      <div
        className="Master"
        style={{ backgroundImage: `url(${sceneBackgrounds.CombatTutorial})` }}
      >
        <Talking
          name={cutscene.dialogue.name}
          message={cutscene.dialogue.message}
          src={cutscene.dialogue.src}
        />
      </div>
    );
  }

  return (
    <BattleScene
      npcType="dummy"
      redirectTo="/home"
      victoryDescription="Você derrotou o boneco de treino!"
      background={sceneBackgrounds.CombatTutorial}
      audioSrc={KickBack}
    >
      <CombatTutorialTasks />
    </BattleScene>
  );
}

function CombatTutorialTasks() {
  const { instruction, getTaskStatus } = useCombatTasks();

  return (
    <div className={styles.overlay}>
      <div className={styles.taskBox}>
        <img className={styles.image} src={npcPath("/surica/default.svg")} />
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
  );
}
