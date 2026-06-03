import { BattleScene } from "@/components/Game/Scenes/Battle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useFlags } from "@/contexts/FlagContext";

export default function PcRoomBattleOne() {
  const { setFlag } = useFlags();
  return (
    <BattleScene
      npcType="hungryDeath"
      redirectTo="/pcroom/two"
      onVictory={() => {
        setFlag("hungry");
      }}
      victoryDescription="Você derrotou um morto de fome!"
      className="PcRoomBattle"
      audioSrc={KenTheme}
    />
  );
}