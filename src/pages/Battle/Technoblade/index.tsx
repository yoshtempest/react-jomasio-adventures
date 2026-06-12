import { BattleScene } from "@/components/Game/Scenes/Battle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useNavigate } from "react-router";

export default function TechnobladeBattle() {
  const navigate = useNavigate();
  return (
    <BattleScene
      npcType="technoblade"
      onVictory={() => navigate(-1)}
      victoryDescription="Você derrotou o rei"
      className="CantinaBattle"
      audioSrc={KenTheme}
    />
  );
}