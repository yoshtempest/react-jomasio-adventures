import { useCallback } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { BattleScene } from "@/components/Game/Scenes/Battle";
import { useFlags } from "@/contexts/FlagContext";
import { BATTLE_CONFIGS, ROUTE_TO_BATTLE_KEY } from "@/data/battle/config";

export default function BattlePage() {
  const { pathname } = useLocation();
  const key = ROUTE_TO_BATTLE_KEY[pathname];
  const config = key ? BATTLE_CONFIGS[key] : undefined;
  const { setFlag } = useFlags();
  const navigate = useNavigate();
  const training = key === "training";

  const handleVictory = useCallback(() => {
    config?.onVictory?.({ setFlag, navigate });
  }, [config, setFlag, navigate]);

  if (!config) {
    return <div>Batalha não encontrada</div>;
  }

  return (
    <BattleScene
      npcType={config.npcType}
      redirectTo={config.redirectTo}
      onVictory={handleVictory}
      victoryDescription={config.victoryDescription}
      background={config.background}
      audioSrc={config.audioSrc}
      training={training}
    />
  );
}
