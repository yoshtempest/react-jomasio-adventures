import { BattleScene } from "@/components/Game/Scenes/Battle";
import SpiderDance from "/assets/songs/SpiderDance.m4a"
import { useFlags } from "@/contexts/FlagContext";

export default function PlanetarySistersBattle() {
  const { setFlag } = useFlags();

  return (
    <BattleScene
      npcType="planetarySisters"
      redirectTo="/hall/center-two"
      onVictory={() => {
        setFlag("planetarySisters");
      }}
      victoryDescription="Você derrotou as Irmãs Planetárias e agora pode passar"
      className="hallCenterBattle"
      audioSrc={SpiderDance}
    />
  );
}