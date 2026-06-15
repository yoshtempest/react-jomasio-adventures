import { BattleScene } from "@/components/Game/Scenes/Battle";
import GuiltyGear from "/assets/songs/GuiltyGear.mp3";
import { useFlags } from "@/contexts/FlagContext";

export default function HellroomBattle() {
  const { setFlag } = useFlags();

  return (
    <BattleScene
      npcType="maugrelo"
      redirectTo="/hellroom/three"
      onVictory={() => {
        setFlag("maugrelo");
      }}
      victoryDescription="Você derrotou Maugrelo, mas ele parece ter gostado de apanhar?"
      className="HellRoomBattle"
      audioSrc={GuiltyGear}
    />
  );
}
