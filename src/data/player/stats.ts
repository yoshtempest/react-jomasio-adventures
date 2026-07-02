import { stat, progressStat } from "@/utils/types/stats";
import { formatTime } from "@/contexts/PlayTimeContext";

type SummaryStatsProps = {
  totalPlayTime: number;
  totalBattleTime: number;
  coins: number;
  hyperCoins: number;
  loginDays: number;
  totalKills: number;
  bestStreak: number;
  totalDeaths: number;
  damageDealt: number;
  damageTaken: number;
  blocks: number;
  hitsUsed: number;
  specialsUsed: number;
  attacksUsed: number;
};

type CharacterStatsProps = {
  totalPlayTime: number;
  totalBattleTime: number;
  coins: number;
  hyperCoins: number;
  totalKills: number;
  bestStreak: number;
  totalDeaths: number;
  damageDealt: number;
  damageTaken: number;
  blocks: number;
  hitsUsed: number;
  specialsUsed: number;
  attacksUsed: number;
};

type ProgressStatsProps = {
    acquiredTitles: number;
    totalTitles: number;
    encounteredNpcs: number;
    totalNpcs: number;
    completedFlags: number;
    totalStoryFlags: number;
    maxLevelReached: number;
    completedSideQuests: number;
    totalSideQuests: number;
};

export function getSummaryStats(data: SummaryStatsProps) {
    return [
        stat("Tempo total", formatTime(data.totalPlayTime)),
        stat("Tempo em batalha", formatTime(data.totalBattleTime)),
        stat("Kwanzas", data.coins),
        stat("HyperCoins", data.hyperCoins),
        stat("Máx. vitórias consecutivas", data.bestStreak),
        stat("Total de inimigos derrotados", data.totalKills),
        stat("Total de derrotas", data.totalDeaths),
        stat("Dano total causado", data.damageDealt),
        stat("Dano total recebido", data.damageTaken),
        stat("Bloqueios", data.blocks),
        stat("Golpes usados", data.hitsUsed),
        stat("Especiais usados", data.specialsUsed),
        stat("Ataques comuns", data.attacksUsed),
        stat("Dias Jogados", data.loginDays),
    ];
}

export function getCharacterStats(data: CharacterStatsProps) {
    return [
        stat("Tempo total", formatTime(data.totalPlayTime)),
        stat("Tempo em batalha", formatTime(data.totalBattleTime)),
        stat("Kwanzas", data.coins),
        stat("HyperCoins", data.hyperCoins),
        stat("Máx. vitórias consecutivas", data.bestStreak),
        stat("Total de inimigos derrotados", data.totalKills),
        stat("Total de derrotas", data.totalDeaths),
        stat("Dano total causado", data.damageDealt),
        stat("Dano total recebido", data.damageTaken),
        stat("Bloqueios", data.blocks),
        stat("Golpes usados", data.hitsUsed),
        stat("Especiais usados", data.specialsUsed),
        stat("Ataques comuns", data.attacksUsed),
    ];
}

export function getProgressStat(data: ProgressStatsProps) {
    return [
        progressStat("Títulos", data.acquiredTitles, data.totalTitles),
        progressStat("NPCs encontrados", data.encounteredNpcs, data.totalNpcs),
        progressStat("História", data.completedFlags, data.totalStoryFlags),
        progressStat("Nível 100", data.maxLevelReached, 100),
        progressStat("Sidequests", data.completedSideQuests, data.totalSideQuests),
    ]
}