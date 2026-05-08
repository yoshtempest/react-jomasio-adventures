import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";


export default function PcRoomBattleOne() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="hungryDeath"
      redirectTo="/pcroom/three"
      victoryDescription="Você derrotou um morto de fome!"
      className="PcRoomBattle"
      audioSrc={KenTheme}
    />
  );
}