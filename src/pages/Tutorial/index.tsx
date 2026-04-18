import { useMemo, useState, useCallback, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import Talking from "@/components/Talking";
import styles from "./styles.module.css";
import SOS from "@/assets/songs/SOSFromEarth.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNavigate } from "react-router";
import { useCutscene } from "@/hooks/useCutscene";
import { useSansTalking } from "@/hooks/useSansTalking";
import { tutorialDialogue } from "@/data/maps/tutorial";
import { usePlayer } from "@/contexts/PlayerContext";


export default function Tutorial() {
  const navigate = useNavigate();

  const [showNameInput, setShowNameInput] = useState(false);
  const [showGenderChoice, setShowGenderChoice] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [genderIndex, setGenderIndex] = useState(0); // 0 = macho, 1 = fêmea

  const { play: playSansTalking } = useSansTalking(false);

  const { setCharacter, setMode } = usePlayer();

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
          setMode("ui");
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

    localStorage.setItem("playerName", playerName.trim()); // 🔥 salva

    setShowNameInput(false);
    setMode("explore"); // 🔥 IMPORTANTE
    cutscene.next();
  }, [playerName, cutscene]);

  const handleChooseGender = (gender: "marcelo" | "eduarda") => {
    localStorage.setItem("playerCharacter", gender); // 🔥 salva
    setCharacter(gender); // 🔥 salva no contexto global
    setShowGenderChoice(false);
    setMode("explore"); // 🔥 IMPORTANTE
    cutscene.next();
  };

  useEffect(() => {
    if (!showGenderChoice) return;

    function handleKeyDown(e: KeyboardEvent) {
      e.stopPropagation(); // 🔥 impede conflito com o jogo

      if (e.key === "d" || e.key === "ArrowRight") {
        setGenderIndex(1); // vai pra fêmea
      }

      if (e.key === "a" || e.key === "ArrowLeft") {
        setGenderIndex(0); // volta pra macho
      }

      if (e.key === "Enter") {
        const selected = genderIndex === 0 ? "marcelo" : "eduarda";
        handleChooseGender(selected);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showGenderChoice, genderIndex]);

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
                autoFocus // 👈 importante
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation(); // continua bloqueando o jogo

                  if (e.key === "Enter") {
                    handleSubmitName(); // 👈 envia com Enter
                  }
                }}
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
              <button 
                className={genderIndex === 0 ? styles.selected : ""}
                onClick={() => handleChooseGender("marcelo")}
              >
                Macho
              </button>

              <button 
                className={genderIndex === 1 ? styles.selected : ""}
                onClick={() => handleChooseGender("eduarda")}
              >
                Fêmea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}