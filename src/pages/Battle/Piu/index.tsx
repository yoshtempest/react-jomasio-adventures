import { BattleScene } from "@/components/Game/Scenes/Battle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useNavigate } from "react-router";

export default function PiuBattle() {
  const navigate = useNavigate();
  return (
    <BattleScene
      npcType="piupiu"
      onVictory={() => navigate(-1)}
      victoryDescription="Você derrotou um Pinto!"
      className="CafeteriaBattle"
      audioSrc={KenTheme}
    />
  );
}
