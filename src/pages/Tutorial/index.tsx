import { useEffect, useState } from "react";
import { useGameControls } from "../../contexts/GameControlsContext";
import Talking from "../../components/Talking";
import styles from "./styles.module.css";

export default function Tutorial() {
  const { setOnConfirm } = useGameControls();

  const dialogues = [
    {
      name: "Duque Cê",
      message: "Bem-vindo ao mundo Po- Real, não vou encher linguiça, você deve investigar o CETI Jomásio dos Santos Barros pelo sumiço da comida.",
    },
    {
      name: "Duque Cê",
      message: "Mas antes disso, tipo assim, você... qual é seu nome mesmo?",
    },
    {
      name: "Duque Cê",
      message: "Entendo... bem eu não ligo sobre quem é você, apenas faça seu trabalho com perfeição, Adeus.",
    },
  ];

  const [index, setIndex] = useState(0);

  function nextDialogue() {
    setIndex((prev) => Math.min(prev + 1, dialogues.length - 1));
  }

  useEffect(() => {
    setOnConfirm(() => nextDialogue);

    return () => {
      setOnConfirm(undefined); // limpa ao sair da tela
    };
  }, []);

  return (
    <div className={`Master ${styles.image}`}>
      <Talking
        name={dialogues[index].name}
        message={dialogues[index].message}
      />
    </div>
  );
}