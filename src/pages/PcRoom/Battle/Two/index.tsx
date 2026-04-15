import { BattleScene } from "@/components/Game/BattleScene";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "@/assets/songs/StreetFighter5KenTheme.m4a";


export default function PcRoomBattleTwo() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="vandinha"
      redirectTo="/pcroom/Five"
      className="PcRoomBattle"
      victoryDescription="Você escapou com sucesso de Vandinha"
      audioSrc={KenTheme}
    />
  );
}