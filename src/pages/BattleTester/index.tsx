import { useNavigate, useParams } from "react-router";
import { BattleScene } from "@/components/Game/Scenes/Battle";
import { NPCS } from "@/data/npc/npc";
import { sceneBackgrounds } from "@/data/scene/background";
import { backgroundAudioPath } from "@/utils/paths";

export default function BattleTester() {
  const { npcId } = useParams<{ npcId: string }>();
  const navigate = useNavigate();

  if (!npcId || !NPCS[npcId]) {
    return <div>NPC não encontrado</div>;
  }

  return (
    <BattleScene
      npcType={npcId}
      onVictory={() => navigate(-1)}
      victoryDescription={`Você derrotou ${npcId}`}
      background={sceneBackgrounds.CombatTutorial}
      audioSrc={backgroundAudioPath("/battle/StreetFighter5KenTheme.m4a")}
    />
  );
}
