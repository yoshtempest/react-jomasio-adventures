import { BattleScene } from "@/components/Game/Scenes/Battle";
import KickBack from "/assets/songs/KickBack.mp3"
import { useFlags } from "@/contexts/FlagContext";

export default function MauraoBattle() {
  const { setFlag } = useFlags();

  return (
    <BattleScene
      npcType="maurao"
      redirectTo="/hall/pandemony/two"
      onVictory={() => {
        setFlag("maurao");
      }}
      victoryDescription="Você salvou Maurão da loucura"
      className="hallCenterBattle"
      audioSrc={KickBack}
    />
  );
}