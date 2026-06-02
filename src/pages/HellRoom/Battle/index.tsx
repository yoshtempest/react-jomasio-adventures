import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import SpiderDance from "/assets/songs/SpiderDance.m4a"
import { useFlags } from "@/contexts/FlagContext";

export default function HellroomBattle() {
  const { setFlag } = useFlags();

  return (
    <BattleScene
      map={firstBattle}
      npcType="maugrelo"
      redirectTo="/hellroom/three"
      onVictory={() => {
        setFlag("maugrelo");
      }}
      victoryDescription="Você derrotou Maugrelo, mas ele parece ter gostado de apanhar?"
      className="hellroomBattle"
      audioSrc={SpiderDance}
    />
  );
}