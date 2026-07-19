import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { getRank, formatRank } from "@/gameRules/rank";
import { PlayerHUDPanel } from "./PlayerHUDPanel";
import { NPCHUDPanel } from "./NPCHUDPanel";
import { SummonHUDList } from "./SummonHUDList";

type BattleHUDState = {
  playerHP: number;
  playerMaxHp: number;
  playerShield: number;
  npcHP: number;
  delicia: number;
  hitsToSpecial: number;
  blockGauge: number;
  blockLimit: number;
  petHP?: number;
  petMaxHp?: number;
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
};

export function BattleHUD({ battle, npcStats, npcType, npcLevel, summons }: Props) {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const playerName = localStorage.getItem("playerName") || "Protagonista";
  const playerRank = formatRank(getRank(progress[player.character]?.level ?? 1));

  return (
    <>
      <PlayerHUDPanel
        character={player.character}
        playerName={playerName}
        playerRank={playerRank}
        hp={battle.playerHP}
        maxHp={battle.playerMaxHp}
        shield={battle.playerShield}
        delicia={battle.delicia}
        hitsToSpecial={battle.hitsToSpecial}
        blockGauge={battle.blockGauge}
        blockLimit={battle.blockLimit}
        petHP={battle.petHP}
        petMaxHp={battle.petMaxHp}
      />

      {npcType && (
        <NPCHUDPanel
          npcType={npcType}
          npcLevel={npcLevel}
          npcHP={battle.npcHP}
          npcMaxHp={npcStats.hp}
        />
      )}

      {summons && summons.length > 0 && (
        <SummonHUDList summons={summons} npcType={npcType} />
      )}
    </>
  );
}
