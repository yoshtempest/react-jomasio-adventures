import { stat } from "@/utils/types/stats";
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
  misses: number;
  equipmentDrops: number;
  hitsUsed: number;
  specialsUsed: number;
  attacksUsed: number;
};

type CharacterStatsProps = {
  playTime: number;
  battleTime: number;
  totalPlayTime: number;
  kills: number;
  bestStreak: number;
  deaths: number;
  damageDealt: number;
  damageTaken: number;
};

export function getSummaryStats(data: SummaryStatsProps) {
    return [
        stat("Tempo total", formatTime(data.totalPlayTime)),
        stat("Tempo em batalha", formatTime(data.totalBattleTime)),
        stat("Kwanzas", data.coins),
        stat("HyperCoins", data.hyperCoins),
        stat("Dias Jogados", data.loginDays),
        stat("Máx. vitórias consecutivas", data.bestStreak),
        stat("Total de inimigos derrotados", data.totalKills),
        stat("Total de derrotas", data.totalDeaths),
        stat("Dano total causado", data.damageDealt),
        stat("Dano total recebido", data.damageTaken),
        stat("Bloqueios", data.blocks),
        stat("Misses", data.misses),
        stat("Equipamentos dropados", data.equipmentDrops),
        stat("Golpes usados", data.hitsUsed),
        stat("Especiais usados", data.specialsUsed),
        stat("Ataques comuns", data.attacksUsed),
    ];
}

export function getCharacterStats(data: CharacterStatsProps) {
    return [
        stat("Tempo total", formatTime(data.totalPlayTime)),
        stat("Tempo em batalha", formatTime(data.battleTime)),
        stat("% do Tempo total", data.totalPlayTime > 0 ? Math.round(
            (data.playTime / data.totalPlayTime) * 100) : 0),
        stat("Máx. vitórias consecutivas", data.bestStreak),
        stat("Total de inimigos derrotados", data.kills),
        stat("Total de derrotas", data.deaths),
        stat("Dano total causado", data.damageDealt),
        stat("Dano total recebido", data.damageTaken),
    ];
}