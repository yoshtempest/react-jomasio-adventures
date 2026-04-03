import { useMemo, useState, useCallback } from "react";
import { SendHorizontal } from "lucide-react";
import Talking from "@/components/Talking";
import styles from "./styles.module.css";
import SOS from "@/assets/SOSFromEarth.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNavigate } from "react-router";
import { useCutscene } from "@/hooks/useCutscene";
import { useSansTalking } from "@/hooks/useSansTalking";
import { tutorialDialogue } from "@/data/tutorial";

export default function Tutorial() {
  const navigate = useNavigate();

  const [showInput, setShowInput] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const { play: playSansTalking } = useSansTalking(false);

  const backgroundAudio = useMemo(() => ({
    src: SOS,
    loop: true,
    volume: 1,
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
          if (!showInput) {
            setShowInput(true);
            return false; // 🔥 BLOQUEIA avanço
          }
        }

        if (showInput) return false;

        return true;
      },
  });

  const handleSubmitName = useCallback(() => {
    if (!playerName.trim()) return;

    setShowInput(false);
    cutscene.next();
  }, [playerName, cutscene]);

  return (
    <div className={`Master ${styles.image}`}>
      <Talking
        name={cutscene.dialogue.name}
        message={cutscene.dialogue.message}
      />

      {showInput && (
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
    </div>
  );
}