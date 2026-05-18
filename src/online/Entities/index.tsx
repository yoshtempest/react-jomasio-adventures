import { PlayerBattle } from "@/components/Game/Player/Battle";


type Props = {
  npc: any;
  player: any;
  battle: any;
  npcType: string;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
};

export function BattleEntities({ player, PLAYER_SIZE }: Props) {
  return (
    <>
      <PlayerBattle
        character={player.character}
        x={player.x}
        y={player.y}
        PLAYER_SIZE={PLAYER_SIZE}
        state={player.state}
        direction={player.battleDirection}
      />
      <PlayerBattle
        character={player.character}
        x={player.x}
        y={player.y}
        PLAYER_SIZE={PLAYER_SIZE}
        state={player.state}
        direction={player.battleDirection}
      />
    </>
  );
}