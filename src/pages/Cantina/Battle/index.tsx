import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useFlags } from "@/contexts/FlagContext";
import { useNavigate } from "react-router";

export default function CantinaBattle() {
  const { setFlag } = useFlags();
  const navigate = useNavigate();
  return (
    <BattleScene
      map={firstBattle}
      npcType="jhowsimar"
      redirectTo="/cantina/one"
      onVictory={() => {
        navigate("/cantina/one");
        setFlag("cantina_battle_done");
      }}
      victoryDescription="Você derrotou 'Jhow Simar, o Vigia'"
      className="CantinaBattle"
      audioSrc={KenTheme}
    />
  );
}