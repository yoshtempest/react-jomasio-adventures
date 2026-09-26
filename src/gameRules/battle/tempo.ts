/**
 * REGRA DE TEMPO DA BATALHA
 * ========================
 * Um efeito de tempo (congelamento, slow-motion, escala de recarga) é declarado
 * **uma vez** e consultado por todas as entidades móveis/atacantes, em vez de
 * cada habilidade reiterate o seu próprio conjunto de refs (`hitstopRef`,
 * `projectilesFreezeUntilRef`, `freezeSummonsUntilRef`, ...).
 *
 * O caso geral dos efeitos de batalha é "atinge tudo, exceto quem aplicou": o
 * `exempt` é o que expressa isso. O hitstop é o caso degenerado (congela tudo,
 * ninguém isento).
 *
 * Semântica por entidade:
 * - `speed === 0` → a entidade está **congelada**: o tick dela não roda, então
 *   não move, não colide e não ataca.
 * - `speed > 0` → o tick roda, o movimento é multiplicado por `speed` e o
 *   cooldown de ataque é multiplicado por `cooldown` (2 = ataca 2x mais devagar).
 *
 * Efeitos combinam pelo pior caso entre os que atingem a entidade: `speed` é o
 * menor e `cooldown` é o maior.
 *
 * O **player** não faz parte de `TempoKind`: o gate de ação dele é o
 * `freezeActionsUntilRef`, compartilhado por dez habilidades (câmera, Vastolord,
 * Emanuel, Órbita...). Habilidades que travam o mundo escrevem os dois: o
 * efeito de tempo para o mundo e o lock de ação para o player.
 */

/** Classe de entidade que a regra sabe atingir. */
export type TempoKind =
  /** NPC principal. */
  | "npc"
  /** Summons inimigos. */
  | "summon"
  /** Allies do jogador. */
  | "ally"
  /** Pet. */
  | "pet"
  /** Projéteis do NPC. */
  | "projectile"
  /**
   * Projétil do jogador (esfera do Riquelme). Declarado para efeitos que
   * precisam **isentar** a esfera (`PLAYER_SPHERE_TEMPO_ID`): a esfera anima por
   * tempo absoluto e a fase dela avança pelo `player.state`, então ela nunca
   * consulta a regra — o que a torna 1x por construção, inclusive sob o slow do
   * próprio O Mais Honrado.
   */
  | "playerProjectile";

/** Todas as classes de entidade do mundo da batalha. */
export const ALL_TEMPO_KINDS: TempoKind[] = [
  "npc",
  "summon",
  "ally",
  "pet",
  "projectile",
  "playerProjectile",
];

/**
 * Ids canônicos de entidades de uso único (summons/ally/projétil usam o próprio
 * id). O `NPC_TEMPO_ID` è fixo porque o NPC principal não tem id próprio — summons,
 * allies e projéteis se identificam pelo id que já nasceram.
 */
export const NPC_TEMPO_ID = "npc:main";
export const PET_TEMPO_ID = "pet";
export const PLAYER_SPHERE_TEMPO_ID = "playerProjectile:sphere";

/** Estado de tempo de uma entidade. `speed` 0 = congelada. */
export type BattleTempo = {
  /** Multiplicador de movimento (0 = congelado, 1 = normal, 0.25 = 4x mais lento). */
  speed: number;
  /** Multiplicador do tempo de recarga de ataque (1 = normal, 3 = 3x mais lento). */
  cooldown: number;
};

/** Efeito de tempo ativo no mundo. */
export type TempoEffect = {
  /** Identidade do efeito — `applyTempo` faz upsert por este id. */
  id: string;
  /** Classes de entidade atingidas. */
  kinds: TempoKind[];
  /** Ids de entidade isentos (o caster, ou o projétil dele). */
  exempt: string[];
  /** Timestamp de expiração. */
  until: number;
  /** Multiplicador de movimento (0 = congelado). */
  speed: number;
  /** Multiplicador do tempo de recarga de ataque. */
  cooldown: number;
};

/** Efeito a aplicar; a duração é relativa e vira `until` no `applyTempo`. */
export type TempoSpec = Omit<TempoEffect, "until"> & { durationMs: number };

/** Estado normal: nada afetando. */
export const NEUTRAL_TEMPO: BattleTempo = { speed: 1, cooldown: 1 };

/** Id do efeito global de hitstop (impacto). */
export const HITSTOP_ID = "hitstop";

/**
 * Estado de tempo de uma entidade agora: o pior caso entre os efeitos ativos que
 * a atingem. `entityId` só é usado para checar `exempt` — um efeito sem isentos
 * vale para toda a classe.
 */
export function getTempo(
  effects: TempoEffect[],
  kind: TempoKind,
  entityId: string,
  now = Date.now(),
): BattleTempo {
  let speed = 1;
  let cooldown = 1;

  for (const effect of effects) {
    if (effect.until <= now) continue;
    if (!effect.kinds.includes(kind)) continue;
    if (effect.exempt.includes(entityId)) continue;
    if (effect.speed < speed) speed = effect.speed;
    if (effect.cooldown > cooldown) cooldown = effect.cooldown;
  }

  return speed === 1 && cooldown === 1 ? NEUTRAL_TEMPO : { speed, cooldown };
}

/** A entidade está congelada (speed 0)? Atalho para o gate `return` do tick. */
export function isTempoFrozen(
  effects: TempoEffect[],
  kind: TempoKind,
  entityId: string,
  now = Date.now(),
): boolean {
  return getTempo(effects, kind, entityId, now).speed === 0;
}

/**
 * Aplica/renova um efeito (upsert por `id`) e devolve a nova lista. Devolver
 * lista nova em vez de mutar mantém o ref previsível para os consumers.
 */
export function applyTempo(
  effects: TempoEffect[],
  spec: TempoSpec,
  now = Date.now(),
): TempoEffect[] {
  const next: TempoEffect[] = [];
  for (const effect of effects) {
    if (effect.id !== spec.id) next.push(effect);
  }
  next.push({
    id: spec.id,
    kinds: spec.kinds,
    exempt: spec.exempt,
    speed: spec.speed,
    cooldown: spec.cooldown,
    until: now + spec.durationMs,
  });
  return next;
}

/** Encerra um efeito antes do prazo (cleanup de habilidade). */
export function clearTempo(effects: TempoEffect[], id: string): TempoEffect[] {
  if (!effects.some((effect) => effect.id === id)) return effects;
  return effects.filter((effect) => effect.id !== id);
}

/**
 * Congelamento global de impacto: o caso degenerado da regra, sem isentos.
 * Substitui o antigo `hitstopRef` (um único timestamp compartilhado por todo
 * mundo) — agora é só mais um efeito na lista.
 */
export function applyHitstop(
  effects: TempoEffect[],
  durationMs: number,
  now = Date.now(),
): TempoEffect[] {
  return applyTempo(
    effects,
    {
      id: HITSTOP_ID,
      kinds: ALL_TEMPO_KINDS,
      exempt: [],
      speed: 0,
      cooldown: 1,
      durationMs,
    },
    now,
  );
}

/**
 * Spec de "congela o mundo inteiro" — atalho para as habilidades de área
 * (Killer Queen, Expansão de Domínio, O Mais Honrado).
 */
export function freezeWorldSpec(
  id: string,
  durationMs: number,
  exempt: string[] = [],
): TempoSpec {
  return {
    id,
    kinds: ALL_TEMPO_KINDS,
    exempt,
    speed: 0,
    cooldown: 1,
    durationMs,
  };
}

/**
 * Spec de "desacelera o mundo inteiro" — o tick continua rodando, mas movimento
 * e recarga de ataque saem multiplicados. É o caso do O Mais Honrado, em que
 * só o caster e o projétil dele ficam no tempo normal.
 */
export function slowWorldSpec(
  id: string,
  durationMs: number,
  multipliers: { speed: number; cooldown: number },
  exempt: string[] = [],
  kinds: TempoKind[] = ALL_TEMPO_KINDS,
): TempoSpec {
  return { id, kinds, exempt, ...multipliers, durationMs };
}

/**
 * Escala um tempo em ms pelo multiplicador de cooldown da entidade. Concentrar
 * aqui evita que cada consumer aplique o regra de combinação por conta própria.
 */
export function scaleCooldown(tempo: BattleTempo, cooldownMs: number): number {
  return cooldownMs * tempo.cooldown;
}
