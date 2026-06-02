import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";


export default function PcRoomBattleThree() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="hungryKing"
      redirectTo="/pcroom/nine"
      className="PcRoomBattle"
      victoryDescription="Você salvou Samurion de seu próprio culto de mortos de fome"
      audioSrc={KenTheme}
    />
  );
}