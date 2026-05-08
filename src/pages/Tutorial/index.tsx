import { useMemo, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import Talking from "@/components/Talking";
import styles from "./styles.module.css";
import SOS from "/assets/songs/SOSFromEarth.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNavigate } from "react-router";
import { useCutscene } from "@/hooks/interaction/useCutscene";
import { useSansTalking } from "@/hooks/interaction/useSansTalking";
import { tutorialDialogue } from "@/data/maps/tutorial";

import { useTutorialFlow } from "@/hooks/tutorial/useTutorialFlow";
import { useNameInput } from "@/hooks/tutorial/useNameInput";
import { useQuestActions } from "@/hooks/useQuestActions";
import { QUESTS } from "@/data/quests";

export default function Tutorial() {
  const navigate = useNavigate();
  const { play: playSansTalking } = useSansTalking(false);
  const { giveQuest } = useQuestActions();

  const flow = useTutorialFlow();
  const inputRef = useRef<HTMLInputElement>(null);

  const nameInput = useNameInput(() => {
    flow.closeNameInput();
    cutscene.next();
  });

  useEffect(() => {
    if (!flow.showNameInput) return;

    const input = inputRef.current;

    if (!input) return;

    // foco inicial
    input.focus();

    // mantém foco mesmo se perder
    const handleBlur = () => {
      setTimeout(() => {
        input.focus();
      }, 0);
    };

    input.addEventListener("blur", handleBlur);

    return () => {
      input.removeEventListener("blur", handleBlur);
    };
  }, [flow.showNameInput]);

  const backgroundAudio = useMemo(() => ({
    src: SOS,
    loop: true,
    volume: 0.3,
  }), []);

  useGameAudio(backgroundAudio);

  const cutscene = useCutscene({
    dialogue: tutorialDialogue,
    playAudio: playSansTalking,
    onFinish: () => {
      giveQuest(QUESTS.jomasio_investigate)
      navigate("/home")
    },
    onBeforeNext: (dialogue) => {
      if (dialogue.message.includes("qual é seu nome")) {
        if (!flow.showNameInput) {
          flow.openNameInput();
          return false;
        }
      }

      if (flow.showNameInput) return false;

      return true;
    },
  });

  return (
    <div className={`Master ${styles.image}`}>
      <Talking
        name={cutscene.dialogue.name}
        message={cutscene.dialogue.message}
      />

      {flow.showNameInput && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h1>Nome de usuário</h1>

            <div className={styles.relative}>
              <input
                ref={inputRef}
                value={nameInput.playerName}
                onChange={(e) => nameInput.setPlayerName(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();

                  if (e.key === "Enter") {
                    nameInput.submit();
                  }
                }}
              />

              <SendHorizontal
                className={styles.sendButton}
                color="black"
                onClick={nameInput.submit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}