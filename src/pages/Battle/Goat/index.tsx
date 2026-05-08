import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useNavigate } from "react-router";

export default function GoatBattle() {
  const navigate = useNavigate();
  return (
    <BattleScene
      map={firstBattle}
      npcType="goat"
      onVictory={() => navigate(-1)}
      victoryDescription="Você derrotou um bode!"
      className="CantinaBattle"
      audioSrc={KenTheme}
    />
  );
}