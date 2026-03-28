import { useEffect, useMemo, useState, useCallback } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { SendHorizontal } from "lucide-react";
import Talking from "@/components/Talking";
import styles from "./styles.module.css";
import SOS from "@/assets/SOSFromEarth.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNavigate } from "react-router";
import { useDialogue } from "@/hooks/useDialogue";

export default function Tutorial() {
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();

  // 🔊 áudio estável
  const backgroundAudio = useMemo(() => ({
    src: SOS,
    loop: true,
    volume: 1,
  }), []);

  useGameAudio(backgroundAudio);

  // ✅ evita recriar função a cada render
  const handleFinish = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  // ✅ diálogos estáveis
  const dialogues = useMemo(() => [
    {
      name: "Duque Sê",
      message:
        "Bem-vindo ao mundo Po- Real, não vou encher linguiça... você deve investigar o CETI Jomásio dos Santos Barros pelo sumiço da comida.",
    },
    {
      name: "Duque Sê",
      message:
        "Mas antes disso, tipo assim, você... qual é seu nome mesmo?",
    },
    {
      name: "Duque Sê",
      message:
        "Entendo... bem eu não ligo sobre quem é você, apenas faça seu trabalho com perfeição, Adeus.",
    },
  ], []);

  const dialogueSystem = useDialogue(dialogues, handleFinish);

  // ✅ inicia automaticamente (agora seguro)
  useEffect(() => {
    dialogueSystem.start();
  }, []);

  const [showInput, setShowInput] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const currentMessage = dialogueSystem.dialogue?.message;

  // ✅ estável
  const handleConfirm = useCallback(() => {
    if (!currentMessage) return;

    if (currentMessage.includes("qual é seu nome")) {
      if (!showInput) {
        setShowInput(true);
        return;
      }
    }

    if (showInput) return;

    dialogueSystem.next();
  }, [currentMessage, showInput, dialogueSystem]);

  // ✅ registro global de input
  useEffect(() => {
    setOnConfirm(() => handleConfirm);

    return () => {
      setOnConfirm(undefined);
    };
  }, [handleConfirm, setOnConfirm]);

  const handleSubmitName = useCallback(() => {
    if (!playerName.trim()) return;

    setShowInput(false);
    dialogueSystem.next();
  }, [playerName, dialogueSystem]);

  return (
    <div className={`Master ${styles.image}`}>
      {dialogueSystem.isOpen && dialogueSystem.dialogue && (
        <Talking
          name={dialogueSystem.dialogue.name}
          message={dialogueSystem.dialogue.message}
        />
      )}

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