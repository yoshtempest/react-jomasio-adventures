import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import Jojo from "@/assets/songs/Jojo.m4a";

export default function LibraryBattleTwo() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="vandinhaFragment"
      redirectTo="/library"
      victoryDescription="Você derrotou um fragmento de vandinha!"
      className="LibraryBattle"
      audioSrc={Jojo}
    />
  );
}