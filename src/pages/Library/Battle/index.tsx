import { BattleScene } from "@/components/Game/BattleScene";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "@/assets/songs/StreetFighter5KenTheme.m4a";

export default function LibraryBattle() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="jhowsimar"
      redirectTo="/library"
      victoryDescription="Você derrotou um morto de fome!"
      className="LibraryBattle"
      audioSrc={KenTheme}
    />
  );
}