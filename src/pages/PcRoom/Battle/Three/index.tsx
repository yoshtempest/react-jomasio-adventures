import { BattleScene } from "@/components/Game/Scenes/Battle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useFlags } from "@/contexts/FlagContext";

export default function PcRoomBattleThree() {
  const { setFlag } = useFlags();
  return (
    <BattleScene
      npcType="hungryKing"
      redirectTo="/pcroom/seven"
      className="PcRoomBattle"
      onVictory={() => {
        setFlag("hungryKing");
        setFlag("samurionUnlocked");
      }}
      victoryDescription="Você salvou Samurion de seu próprio culto de mortos de fome"
      audioSrc={KenTheme}
    />
  );
}
