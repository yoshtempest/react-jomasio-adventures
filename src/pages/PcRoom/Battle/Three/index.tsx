import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useFlags } from "@/contexts/FlagContext";

export default function PcRoomBattleThree() {
  const { setFlag } = useFlags();
  return (
    <BattleScene
      map={firstBattle}
      npcType="hungryKing"
      redirectTo="/pcroom/nine"
      className="PcRoomBattle"
      onVictory={() => {
        setFlag("hungryking_intro_done");
        setFlag("hungryking_battle_won");
      }}
      victoryDescription="Você salvou Samurion de seu próprio culto de mortos de fome"
      audioSrc={KenTheme}
    />
  );
}