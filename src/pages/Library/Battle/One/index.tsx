import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "@/assets/songs/StreetFighter5KenTheme.m4a";

export default function LibraryBattleOne() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="hungryDeath"
      redirectTo="/library"
      victoryDescription="Você derrotou um morto de fome!"
      className="LibraryBattle"
      audioSrc={KenTheme}
    />
  );
}