import { PlayerBattle } from "@/components/Game/Entities/Player/Battle";
import type { BlinkVisual } from "@/hooks/battle/player/characters/natsuki/useBlinkAnimation";

type Props = {
  player: Player;
  PLAYER_SIZE: number;
  weapon?: LucasWeapon;
  grabFlipped?: boolean;
  form?: "vastolordForm";
  /** Quadro da transformação do marcelo (0=screamOne … 3=transformated) ou null. */
  transformationFrame?: number | null;
  blinkVisual?: BlinkVisual | null;
  /** Emanuel segurando a instância: troca o sprite para teleport.svg. */
  teleportSprite?: boolean;
  /** Durante o specialBackground: troca o sprite para preAtomic.svg. */
  preAtomic?: boolean;
  /** Halo.svg acima do sprite durante preparing/finalizating do "I Am Atomic". */
  atomicHalo?: boolean;
  /** Flash no sprite quando a explosion.svg da habilidade aparece. */
  atomicFlash?: boolean;
  /** Blink do teleporte da Expansão de Domínio do marcelo. */
  mugetsuBlink?: "out" | "in" | null;
};

export function Player({
  player,
  PLAYER_SIZE,
  weapon,
  grabFlipped = false,
  form,
  transformationFrame = null,
  blinkVisual = null,
  teleportSprite = false,
  preAtomic = false,
  atomicHalo = false,
  atomicFlash = false,
  mugetsuBlink = null,
}: Props) {
  const blinkSilhouette =
    player.character === "riquelme" && blinkVisual
      ? blinkVisual.teleported
        ? "white"
        : "black"
      : null;

  return (
    <PlayerBattle
      character={player.character}
      x={player.x}
      y={player.y}
      PLAYER_SIZE={PLAYER_SIZE}
      state={player.state}
      direction={player.battleDirection}
      weapon={weapon}
      grabbedUntil={player.grabbedUntil}
      grabFlipped={grabFlipped}
      form={form}
      transformationFrame={transformationFrame}
      blinkSilhouette={blinkSilhouette}
      teleportSprite={teleportSprite}
      preAtomic={preAtomic}
      atomicHalo={atomicHalo}
      atomicFlash={atomicFlash}
      mugetsuBlink={mugetsuBlink}
      levelUpParticles
    />
  );
}
