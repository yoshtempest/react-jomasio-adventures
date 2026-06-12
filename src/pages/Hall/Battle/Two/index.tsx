import { BattleScene } from "@/components/Game/Scenes/Battle";
import KickBack from "/assets/songs/KickBack.mp3"
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
      audioSrc={KickBack}
    />
  );
}