import styles from "./styles.module.css";
import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { configsDialogue } from "@/data/dialogues/configs";
import Talking from "@/components/Talking";
import { useEffect, useRef } from "react";
import { useDialogue } from "@/hooks/interaction/useDialogue";

export function VictorTutorial() {
  const dialogueSystem = useDialogue(configsDialogue);

    const dialogueSystemRef = useRef(dialogueSystem);
    dialogueSystemRef.current = dialogueSystem;

    useEffect(() => {
        dialogueSystemRef.current.start();
    }, []);

    return (
        <div className={styles.tutorialContainer}>
            {dialogueSystem.isOpen && (
                <Talking
                {...dialogueSystem.dialogue}
                onNext={dialogueSystem.next}
                />
            )}

            {!dialogueSystem.isOpen && (
                <>
                <h3>Como funciona a movimentação:</h3>
                <div className={styles.row}>
                    <div className={styles.movement}>
                    <MoveUp size={16} className={styles.up} />

                    <MoveLeft size={16} className={styles.left} />

                    <div className={styles.empty}></div>

                    <MoveRight size={16} className={styles.right} />

                    <MoveDown size={16} className={styles.down} />
                    </div>

                    <div className={`dpad ${styles.dpad}`}>
                    <div className="inner" />
                    </div>

                    <p>Basta apertar na direção que você deseja ir.</p>
                </div>
                <h3>Como funcionam os controles:</h3>
                <div className={styles.row}>
                    <div className={styles.gameButtons}>
                    <button className={styles.button}>B</button>
                    </div>
                    <p>
                    Ao clicar em "B" enquanto está em batalha, você consegue bloquear
                    ataques, Além disso, também pode ser usado para fechar os menus.
                    </p>
                </div>
                <div className={styles.row}>
                    <button className={styles.button}> L </button>
                    <p>
                    Ao clicar em "L", você consegue interagir com as pessoas e com
                    o mapa, caso esteja em batalha, você ataca, caso pressione e segure você
                    irá carregar ataque mais forte.
                    </p>
                </div>
                <div className={styles.row}>
                    <button className={styles.open} />
                    <p>
                    Ao clicar em "G" pelo teclado ou nesse quadrado retangular,
                    você consegue abrir os menus, assim como você fez agora, caso
                    esteja em batalha, após cumprir certas condições você poderá
                    utilizar o ataque especial.
                    </p>
                </div>
                </>
            )}
        </div>
    );
}
