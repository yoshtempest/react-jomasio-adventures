import { useCallback } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { BattleScene } from "@/components/Game/Scenes/Battle";
import { useFlags } from "@/contexts/FlagContext";
import {
  BATTLE_CONFIGS,
  ROUTE_TO_BATTLE_KEY,
  getBattleBackgroundFromRoute,
} from "@/data/battle/config";

export default function BattlePage() {
  const location = useLocation();
  const { pathname } = location;
  const key = ROUTE_TO_BATTLE_KEY[pathname];
  const config = key ? BATTLE_CONFIGS[key] : undefined;
  const { setFlag } = useFlags();
  const navigate = useNavigate();
  const training = key === "training";

  const originRoute = (location.state as { battleOrigin?: string } | null)
    ?.battleOrigin;
  const isAlfa = (location.state as { alfa?: boolean } | null)?.alfa === true;
  const background =
    (originRoute ? getBattleBackgroundFromRoute(originRoute) : "") ||
    config?.background;

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
      background={background}
      audioSrc={config.audioSrc}
      training={training}
      isAlfa={isAlfa}
    />
  );
}
