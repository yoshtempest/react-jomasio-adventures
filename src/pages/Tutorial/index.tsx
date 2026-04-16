import { useMemo, useState, useCallback } from "react";
import { SendHorizontal } from "lucide-react";
import Talking from "@/components/Talking";
import styles from "./styles.module.css";
import SOS from "@/assets/songs/SOSFromEarth.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNavigate } from "react-router";
import { useCutscene } from "@/hooks/useCutscene";
import { useSansTalking } from "@/hooks/useSansTalking";
import { tutorialDialogue } from "@/data/tutorial";
import { usePlayer } from "@/contexts/PlayerContext";


export default function Tutorial() {
  const navigate = useNavigate();

  const [showNameInput, setShowNameInput] = useState(false);
  const [showGenderChoice, setShowGenderChoice] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const { play: playSansTalking } = useSansTalking(false);

  const { setCharacter } = usePlayer();

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
      navigate("/home"); // exemplo
    },
    onBeforeNext: (dialogue) => {
      if (
        dialogue.message ===
        "Mas antes disso, tipo assim, você... qual é seu nome mesmo?"
      ) {
        if (!showNameInput) {
          setShowNameInput(true);
          return false;
        }
      }

      if (
        dialogue.message ===
        "Inclusive... cê é macho ou fêmea? Eu tô de chapéu e não vou parar de farmar aura só para saber disso, entende?"
      ) {
        if (!showGenderChoice) {
          setShowGenderChoice(true);
          return false;
        }
      }

      if (showNameInput || showGenderChoice) return false;

      return true;
    }
  });

  const handleSubmitName = useCallback(() => {
    if (!playerName.trim()) return;

    setShowNameInput(false);
    cutscene.next();
  }, [playerName, cutscene]);

  const handleChooseGender = (gender: "marcelo" | "eduarda") => {
    setCharacter(gender); // 🔥 salva no contexto global
    setShowGenderChoice(false);
    cutscene.next();
  };

  return (
    <div className={`Master ${styles.image}`}>
      <Talking
        name={cutscene.dialogue.name}
        message={cutscene.dialogue.message}
      />

      {showNameInput && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h1>Nome de usuário</h1>
            <div className={styles.relative}>
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Digite seu nome"
              />
              <SendHorizontal
                size={24}
                onClick={handleSubmitName}
                className={styles.sendButton}
                color="black"
              />
            </div>
          </div>
        </div>
      )}
      {showGenderChoice && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h1>Você é...</h1>

            <div className={styles.choices}>
              <button onClick={() => handleChooseGender("marcelo")}>
                Macho
              </button>

              <button onClick={() => handleChooseGender("eduarda")}>
                Fêmea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}