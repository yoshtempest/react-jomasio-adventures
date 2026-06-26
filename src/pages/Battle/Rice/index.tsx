import { BattleScene } from "@/components/Game/Scenes/Battle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useNavigate } from "react-router";

export default function RiceBattle() {
  const navigate = useNavigate();
  return (
    <BattleScene
      npcType="rice"
      onVictory={() => navigate(-1)}
      victoryDescription="Você derrotou um Bolinho de arroz!"
      className="CafeteriaBattle"
      audioSrc={KenTheme}
    />
  );
}
