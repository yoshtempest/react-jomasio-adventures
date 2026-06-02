import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useFlags } from "@/contexts/FlagContext";

export default function CantinaBattle() {
  const { setFlag } = useFlags();
  return (
    <BattleScene
      map={firstBattle}
      npcType="jhowsimar"
      redirectTo="/cantina/one"
      onVictory={() => {
        setFlag("jhowsimar");
      }}
      victoryDescription="Você derrotou 'Jhow Simar, o Vigia'"
      className="CantinaBattle"
      audioSrc={KenTheme}
    />
  );
}