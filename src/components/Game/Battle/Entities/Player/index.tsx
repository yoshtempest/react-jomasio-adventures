import { PlayerBattle } from "@/components/Game/Entities/Player/Battle";
import type { BlinkVisual } from "@/hooks/battle/player/characters/natsuki/useBlinkAnimation";

type Props = {
  player: Player;
  PLAYER_SIZE: number;
  weapon?: LucasWeapon;
  grabFlipped?: boolean;
  form?: "vastolordForm";
  blinkVisual?: BlinkVisual | null;
  /** Emanuel segurando a instância: troca o sprite para teleport.svg. */
  teleportSprite?: boolean;
};

export function Player({
  player,
  PLAYER_SIZE,
  weapon,
  grabFlipped = false,
  form,
  blinkVisual = null,
  teleportSprite = false,
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
      blinkSilhouette={blinkSilhouette}
      teleportSprite={teleportSprite}
    />
  );
}
