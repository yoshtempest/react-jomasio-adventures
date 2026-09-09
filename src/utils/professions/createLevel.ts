/**
 * Cria a tabela de níveis de uma profissão.
 *
 * Cada entrada descreve o recurso "comum" (drop garantido) e a sua "forma
 * rara" (item dropável da profissão) para um nível. O campo nomeado da
 * tabela é fornecido por `levelField` (`rockLevel`, `fishLevel`, ...) e o
 * `xp` base é sempre derivado (`10 + level`), já que segue esse padrão em
 * todas as profissões.
 */
type BaseLevel = {
  level: number;
  commonId: ItemId;
  rareId: ItemId;
  xp: number;
  rareChance: number;
};

export type LevelField =
  "rockLevel" | "fishLevel" | "weightLevel" | "treeLevel";

export function createLevels<K extends LevelField>(
  levelField: K,
  entries: ReadonlyArray<Omit<BaseLevel, "xp">>,
): Array<Record<K, number> & Omit<BaseLevel, "level">> {
  // O computado `[levelField]` perde o literal em runtime, então o cast é
  // necessário e localizado aqui (único ponto da regra).
  return entries.map(({ level, ...rest }) => ({
    [levelField]: level,
    ...rest,
    xp: 10 + level,
  })) as Array<Record<K, number> & Omit<BaseLevel, "level">>;
}
