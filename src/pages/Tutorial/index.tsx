import { useEffect, useMemo, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { SendHorizontal } from "lucide-react";
import Talking from "@/components/Talking";
import styles from "./styles.module.css";
import SOS from "@/assets/SOSFromEarth.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNavigate } from "react-router";


export default function Tutorial() {
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();

  const backgroundAudio = useMemo(() => ({
    src: SOS,
    loop: true,
    volume: 1,
  }), []);

  useGameAudio(backgroundAudio);

  const dialogues = [
    {
      name: "Duque Sê",
      message:
        "Bem-vindo ao mundo Po- Real, não vou encher linguiça, você deve investigar o CETI Jomásio dos Santos Barros pelo sumiço da comida.",
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
  ];

  const [index, setIndex] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [playerName, setPlayerName] = useState("");

  function nextDialogue() {
    //  Se estiver pedindo nome, não avança
    if (index === 1 && !showInput) {
      setShowInput(true);
      return;
    }

    // Se input aberto, não deixa avançar pelo botão A
    if (showInput) return;

    setIndex((prev) => Math.min(prev + 1, dialogues.length - 1));
  }

  function handleSubmitName() {
    if (!playerName.trim()) return;

    setShowInput(false);
    setIndex((prev) => prev + 1);
  }

  useEffect(() => {
    setOnConfirm(() => nextDialogue);

    return () => {
      setOnConfirm(undefined);
    };
  }, [index, showInput]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (index === 2 && !showInput) {
      timeout = setTimeout(() => {
        navigate("/home");
      }, 3000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [index, showInput]);

  return (
    <div className={`Master ${styles.image}`}>
      <Talking
        name={dialogues[index].name}
        message={dialogues[index].message}
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