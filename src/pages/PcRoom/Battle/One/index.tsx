import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useFlags } from "@/contexts/FlagContext";

export default function PcRoomBattleOne() {
  const { setFlag } = useFlags();
  return (
    <BattleScene
      map={firstBattle}
      npcType="hungryDeath"
      redirectTo="/pcroom/two"
      onVictory={() => {
        setFlag("hungry_intro_done");
        setFlag("hungry_battle_won");
      }}
      victoryDescription="Você derrotou um morto de fome!"
      className="PcRoomBattle"
      audioSrc={KenTheme}
    />
  );
}