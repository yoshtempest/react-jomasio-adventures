import { PlayerBattle } from "@/components/Game/Entities/Player/Battle";

type Props = {
  player: Player;
  PLAYER_SIZE: number;
  weapon?: LucasWeapon;
  grabFlipped?: boolean;
};

export function Player({
  player,
  PLAYER_SIZE,
  weapon,
  grabFlipped = false,
}: Props) {
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
    />
  );
}
