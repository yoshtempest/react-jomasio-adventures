import { PlayerBattle } from "@/components/Game/Entities/Player/Battle";

type Props = {
  player: Player;
  PLAYER_SIZE: number;
  grabFlipped?: boolean;
};

export function Player({ player, PLAYER_SIZE, grabFlipped = false }: Props) {
  return (
    <PlayerBattle
      character={player.character}
      x={player.x}
      y={player.y}
      PLAYER_SIZE={PLAYER_SIZE}
      state={player.state}
      direction={player.battleDirection}
      grabbedUntil={player.grabbedUntil}
      grabFlipped={grabFlipped}
    />
  );
}
