import styles from "./styles.module.css";
import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useConfigMenu } from "@/hooks/menu/useConfigMenu";
import { useAudio } from "@/contexts/AudioContext";

import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useEffect } from "react";
import { configsDialogue } from "@/data/maps/configs";
import Talking from "@/components/Talking";
import { useGameControls } from "@/contexts/GameControlsContext";

export function Config() {
  const { difficulty } = usePlayer();
  const { volume } = useAudio();
  const { difficultyList, selectedIndex, selectedRow, screen } = useConfigMenu(true);
  const { pushControls, popControls } = useGameControls();

  const dialogueSystem = useDialogue(configsDialogue);

  useEffect(() => {
    if (screen === "tutorial") {
      dialogueSystem.start();
    }
  }, [screen]);

  useEffect(() => {
    if (!dialogueSystem.isOpen) return;

    const controls = {
      onConfirm: () => {
        dialogueSystem.next();
        return true;
      },
    };

    pushControls(controls);

    return () => popControls();
  }, [dialogueSystem.isOpen]);

  return (
    <div className={styles.config}>
      <h2 className={styles.marginTop}>Dificuldade: {difficulty}</h2>
      <div className={styles.difficultyContainer}>
        {difficultyList.map((diff, index) => {
          const isSelected =
            selectedRow === 0 &&
            index === selectedIndex;
          return (
            <div
              key={diff}
              className={`${styles.difficultyItem} ${
                isSelected ? styles.selected : ""
              }`}
            >
              {isSelected && <span className={styles.cursor}>▼</span>}

              <p>{diff.toUpperCase()}</p>
            </div>
          );
        })}
      </div>
      <div className={styles.volumeContainer}>
        {selectedRow === 1 && (
          <span className={styles.cursor}>▼</span>
        )}

        <h2>Volume: {volume}</h2>

        <div className={styles.volumeBar}>
          <div
            className={styles.volumeFill}
            style={{ width: `${volume}%` }}
          />
        </div>
      </div>
      <div
        className={`${styles.tutorialButton} ${
          selectedRow === 2 ? styles.selected : ""
        }`}
      >
        {selectedRow === 2 && (
          <span className={styles.cursor}>▼</span>
        )}

        <h2>Ver Tutorial</h2>
      </div>

      {screen === "tutorial" && (
        <div className={styles.tutorialContainer}>
          {dialogueSystem.isOpen && (
            <Talking {...dialogueSystem.dialogue} />
          )}

          {!dialogueSystem.isOpen && (
            <>
              <h3>Como funciona a movimentação:</h3>
              <div className={styles.row}>
                <div className={styles.movement}>
                  <MoveUp size={16} className={styles.up}/>

                  <MoveLeft size={16} className={styles.left}/>

                  <div className={styles.empty}></div>

                  <MoveRight size={16} className={styles.right}/>

                  <MoveDown size={16} className={styles.down}/>
                </div>

                <div className={styles.column}>
                  <p>Basta apertar na direção que você deseja ir.</p>
                </div>
              </div>
              <h3>Como funcionam os controles:</h3>
              <div className={styles.row}>
                <div className={styles.gameButtons}>
                    <button className={styles.button}>
                      B
                    </button>
                </div>
                <p>
                  Ao clicar em "B" enquanto está em batalha, 
                  você consegue usar seu Special 
                  caso seu deliciomêtro esteja carregado, 
                  Além disso, também pode ser usado para fechar os menus.
                </p>
              </div>
              <div className={styles.row}>
                <button className={styles.button}> L </button>
                <p>
                  Ao clicar em "L", você consegue interagir com as pessoas e com o mapa, 
                  caso esteja em batalha, 
                  você ataca.
                </p>
              </div>
              <div className={styles.row}>
                <button className={styles.open} />
                <p>
                  Ao clicar em "G" pelo teclado ou nesse quadrado retangular, você consegue abrir os menus,
                  assim como você fez agora, 
                  caso esteja em batalha,
                  após cumprir certas condições
                  você poderá utilizar o modo awakening.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}