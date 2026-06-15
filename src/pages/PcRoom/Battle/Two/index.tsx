import { BattleScene } from "@/components/Game/Scenes/Battle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useFlags } from "@/contexts/FlagContext";

export default function PcRoomBattleTwo() {
  const { setFlag } = useFlags();
  return (
    <BattleScene
      npcType="vandinhaFragment"
      redirectTo="/pcroom/four"
      className="PcRoomBattle"
      onVictory={() => {
        setFlag("vandinhaFragment");
      }}
      victoryDescription="Você derrotou um fragmento de Vandinha"
      audioSrc={KenTheme}
    />
  );
}
