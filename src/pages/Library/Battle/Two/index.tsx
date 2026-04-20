import { BattleScene } from "@/components/Game/BattleScene";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "@/assets/songs/StreetFighter5KenTheme.m4a";

export default function LibraryBattleTwo() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="vandinhaFragment"
      redirectTo="/library"
      victoryDescription="Você derrotou um fragmento de vandinha!"
      className="LibraryBattle"
      audioSrc={KenTheme}
    />
  );
}