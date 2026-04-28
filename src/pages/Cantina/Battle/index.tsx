import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "@/assets/songs/StreetFighter5KenTheme.m4a";

export default function CantinaBattle() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="jhowsimar"
      redirectTo="/cantina/three"
      victoryDescription="Você derrotou 'Jhow Simar, o Vigia'"
      className="CantinaBattle"
      audioSrc={KenTheme}
    />
  );
}