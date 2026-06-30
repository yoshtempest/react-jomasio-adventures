import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { BattleScene } from "@/components/Game/Scenes/Battle";
import { useFlags } from "@/contexts/FlagContext";
import { BATTLE_CONFIGS, ROUTE_TO_BATTLE_KEY } from "@/data/battleConfig";

export default function BattlePage() {
  const { pathname } = useLocation();
  const key = ROUTE_TO_BATTLE_KEY[pathname];
  const config = key ? BATTLE_CONFIGS[key] : undefined;
  const { setFlag } = useFlags();
  const navigate = useNavigate();

  if (!config) {
    return <div>Batalha não encontrada</div>;
  }

  const handleVictory = config.onVictory
    ? () => config.onVictory!({ setFlag, navigate })
    : undefined;

  return (
    <BattleScene
      npcType={config.npcType}
      redirectTo={config.redirectTo}
      onVictory={handleVictory}
      victoryDescription={config.victoryDescription}
      className={config.className}
      audioSrc={config.audioSrc}
    />
  );
}
