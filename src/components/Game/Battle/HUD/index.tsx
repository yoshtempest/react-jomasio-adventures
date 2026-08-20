import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { getRank, formatRank } from "@/gameRules/rank";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { PlayerHUDPanel } from "./PlayerPanel";
import { NPCHUDPanel } from "./NpcPanel";
import { SummonHUDList } from "./SummonList";

type BattleHUDState = {
  playerHP: number;
  playerMaxHp: number;
  playerShield: number;
  npcHP: number;
  delicia: number;
  hitsToSpecial: number;
  blockGauge: number;
  blockLimit: number;
};

type NpcStats = {
  hp: number;
  damage: number;
};

type Props = {
  battle: BattleHUDState;
  npcStats: NpcStats;
  npcType?: string;
  npcLevel?: number;
  summons?: SummonedNpc[];
  isAlfa?: boolean;
};

export function BattleHUD({
  battle,
  npcStats,
  npcType,
  npcLevel,
  summons,
  isAlfa = false,
}: Props) {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const playerName = localStorage.getItem("playerName") || "Protagonista";
  const playerRank = formatRank(
    getRank(progress[player.character]?.level ?? 1),
  );

  return (
    <>
      <PlayerHUDPanel
        character={player.character}
        playerName={playerName}
        playerRank={playerRank}
        playerElementTypes={CHARACTER_ELEMENT_TYPES[player.character]}
        hp={battle.playerHP}
        maxHp={battle.playerMaxHp}
        shield={battle.playerShield}
        delicia={battle.delicia}
        hitsToSpecial={battle.hitsToSpecial}
        blockGauge={battle.blockGauge}
        blockLimit={battle.blockLimit}
      />

      {npcType && (
        <NPCHUDPanel
          npcType={npcType}
          npcLevel={npcLevel}
          npcHP={battle.npcHP}
          npcMaxHp={npcStats.hp}
          isAlfa={isAlfa}
          npcElementTypes={getNpcElementTypes(npcType)}
        />
      )}

      {summons && summons.length > 0 && (
        <SummonHUDList summons={summons} npcType={npcType} />
      )}
    </>
  );
}
