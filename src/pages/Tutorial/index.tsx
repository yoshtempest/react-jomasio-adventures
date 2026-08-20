import { useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import Talking from "@/components/Talking";
import { ChoiceBox } from "@/components/ChoiceBox";
import styles from "./styles.module.css";
import SOS from "/assets/songs/background/battle/SOSFromEarth.m4a";
import { useBackgroundAudio } from "@/hooks/useBackgroundAudio";
import { useNavigate } from "react-router";
import { useCutscene } from "@/hooks/interaction/useCutscene";
import { useSansTalking } from "@/hooks/interaction/useSansTalking";
import { tutorialDialogue } from "@/data/dialogues/tutorial";

import { useTutorialFlow } from "@/hooks/tutorial/useTutorialFlow";
import { useNameInput } from "@/hooks/tutorial/useNameInput";
import { useQuestActions } from "@/hooks/quest/useQuestActions";
import { QUESTS } from "@/data/quests";
import { sceneBackgrounds } from "@/data/scene/background";
import { useNavbar } from "@/contexts/NavbarContext";

export default function Tutorial() {
  const navigate = useNavigate();
  const { play: playSansTalking } = useSansTalking(false);
  const { giveQuest } = useQuestActions();
  const { closeNavbar } = useNavbar();

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

  useBackgroundAudio(SOS);

  useEffect(() => {
    closeNavbar();
  }, [closeNavbar]);

  const cutscene = useCutscene({
    dialogue: tutorialDialogue,
    playAudio: playSansTalking,
    onFinish: () => {
      giveQuest(QUESTS.jomasio_investigate);
      navigate("/combatTutorial");
    },
    onBeforeNext: (dialogue) => {
      if (dialogue.message.includes("qual é seu nome")) {
        if (!flow.showNameInput) {
          flow.openNameInput();
          return false;
        }
      }

      if (dialogue.message.includes("Marshadow ou Drika")) {
        if (!flow.showGenderChoice) {
          flow.openGenderChoice();
          return false;
        }
      }

      if (flow.showNameInput || flow.showGenderChoice) return false;

      return true;
    },
  });

  return (
    <div
      className="Master"
      style={{ backgroundImage: `url(${sceneBackgrounds.Tutorial})` }}
    >
      <Talking
        name={cutscene.dialogue.name}
        message={cutscene.dialogue.message}
      />

      {flow.showGenderChoice && (
        <ChoiceBox
          prompt="Você é macho ou fêmea?"
          options={["Macho", "Fêmea"]}
          onSelect={(index) => {
            const characterId = index === 0 ? "marcelo" : "eduarda";
            flow.chooseGender(characterId);
            cutscene.next();
          }}
        />
      )}

      {flow.showNameInput && (
        <div className={`overlay ${styles.overlay}`}>
          <div>
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
