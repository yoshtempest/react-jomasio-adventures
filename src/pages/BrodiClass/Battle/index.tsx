import { BattleScene } from "@/components/Game/Scenes/Battle";
import SpiderDance from "/assets/songs/SpiderDance.m4a"
import { useFlags } from "@/contexts/FlagContext";

export default function BrodiclassBattle() {
  const { setFlag } = useFlags();

  return (
    <BattleScene
      npcType="srGuaxinim"
      redirectTo="/hellroom/three"
      onVictory={() => {
        setFlag("srGuaxinim");
      }}
      victoryDescription="Você derrotou Sr.Guaxinim e se livrou momentaneamente da fúria de Baal."
      className="hellroomBattle"
      audioSrc={SpiderDance}
    />
  );
}