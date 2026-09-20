import { ProjectileConstants } from "@/data/projectile";
import { playerProjectilePath } from "@/utils/paths";
import {
  VASTOLORD_LASER_BEAM_HEIGHT,
  VASTOLORD_LASER_TOP_GAP,
  type VastolordLaserBeam,
} from "@/hooks/battle/player/characters/marshadow/useVastolordLaser";
import type { BattleEntityPositioning } from "@/components/Game/Battle/Entities/types";

type Props = BattleEntityPositioning & {
  beam: VastolordLaserBeam | null;
};

/**
 * Feixe do Laser da Forma Vastolord: instância `vastolordLaser.svg` esticada
 * de uma ponta do mapa à outra (o sprite tem exatamente 1000x243, a largura
 * do mapa), ancorada na altura do jogador no momento do disparo.
 */
export function VastolordLaser({ beam, battleScaleX, battleScaleY }: Props) {
  if (!beam) return null;

  const width = ProjectileConstants.MAP_WIDTH * battleScaleX;
  const height = VASTOLORD_LASER_BEAM_HEIGHT * battleScaleY;
  const top = (beam.y - VASTOLORD_LASER_TOP_GAP) * battleScaleY;

  return (
    <img
      src={playerProjectilePath("vastolordLaser.svg")}
      alt=""
      draggable={false}
      style={{
        position: "absolute",
        left: 0,
        top,
        width,
        height,
        objectFit: "fill",
        zIndex: 4,
        pointerEvents: "none",
      }}
    />
  );
}