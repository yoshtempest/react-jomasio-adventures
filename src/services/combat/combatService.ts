import { getCharacterElementTypesAtLevel } from "@/data/types/characterElementTypes";
import {
  ELEMENT_STRONG_AGAINST,
  ELEMENT_WEAK_AGAINST,
} from "@/data/types/elementChart";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { getNpcStats } from "@/gameRules/npc/npcStats";
import type { ElementType } from "@/utils/types/battle/element";
import type { BaseCharacter, BasePlayer } from "./character";

export type CombatServiceConfig = {
  superEffectiveMultiplier?: number;
  notVeryEffectiveMultiplier?: number;
  /** Constante de saturação da fórmula de sorte. */
  luckK?: number;
  /**
   * Normaliza o multiplicador elemental pelo número de pares avaliados.
   *
   * `true` (padrão) usa média geométrica: uma criatura com duas colunas fortes
   * bate `1.5^0.5 ≈ 1.22` em vez de `2.25`, e uma com duas fracas cai para
   * `0.71` em vez de `0.25`. `false` volta ao produto cru, que é o comportamento
   * histórico do jogo (multi-tipagem vira explosão numérica).
   */
  normalizeTypingMultiplier?: boolean;
};

type NpcHitParams = {
  npcLevel: number;
  npcClass: NPCClass;
  playerClass: PlayerClass;
  totalArmor: number;
  difficulty: NpcDifficulty;
  npcType: string;
  playerCharacter: CharacterId;
  /** Nível do player — necessário para saber se o despertar racial já vigora. */
  playerLevel?: number;
  npcPhase: number;
  npcHp: number;
  npcMaxHp: number;
};

/**
 * Regras centrais de combate: dano do player, dano recebido por NPCs,
 * elementos, crítico, sorte e cooldowns. Cada método preserva a fórmula
 * original do jogo; a classe existe para dar um único ponto de entrada
 * (e configurável via constructor) para essas regras.
 */
export class CombatService {
  readonly superEffectiveMultiplier: number;
  readonly notVeryEffectiveMultiplier: number;
  readonly luckK: number;
  readonly normalizeTypingMultiplier: boolean;

  constructor(config: CombatServiceConfig = {}) {
    this.superEffectiveMultiplier = config.superEffectiveMultiplier ?? 1.5;
    this.notVeryEffectiveMultiplier = config.notVeryEffectiveMultiplier ?? 0.5;
    this.luckK = config.luckK ?? 199;
    this.normalizeTypingMultiplier = config.normalizeTypingMultiplier ?? true;
  }

  // --- Dano do player -------------------------------------------------

  calculatePlayerDamage(
    strength: number,
    playerClass: string | null,
    baseDamageBonus: number = 0,
  ) {
    let dmg = 12 + strength + baseDamageBonus;

    if (playerClass === "amostradinho") {
      dmg *= 1.1;
    }

    return Math.round(dmg);
  }

  calculateSpecialDamage(intelligence: number, playerClass: string | null) {
    let dmg = 18 + intelligence * 3;

    if (playerClass === "amostradinho") {
      dmg *= 1.1;
    }

    return Math.round(dmg);
  }

  rollCrit(
    damage: number,
    critRate: number,
  ): { damage: number; type: DamageType } {
    if (Math.random() * 100 < critRate) {
      return { damage: damage * 2, type: "crit" };
    }
    return { damage, type: "player" };
  }

  // --- Dano aplicado a NPCs -------------------------------------------

  calculateDamageToNpc(damage: number, npcArmor: number = 0): number {
    if (npcArmor <= 0) return damage;
    return Math.round((damage * 100) / (100 + npcArmor));
  }

  getBerserkMultiplier(currentHP: number, maxHP: number): number {
    const ratio = Math.max(currentHP / maxHP, 0.1);
    return 1 + (1 - ratio) / 0.9;
  }

  calculateMaxHpBonus(maxHp: number, maxHpDamage: number): number {
    if (maxHpDamage <= 0) return 0;
    return Math.round((maxHp * maxHpDamage) / 100);
  }

  // --- Dano recebido pelo player ---------------------------------------

  calculateNpcDamage(
    baseDamage: number,
    playerClass: string | null,
    defense: number = 0,
  ) {
    let dmg = baseDamage;

    if (defense > 0) {
      dmg *= 100 / (100 + defense);
    }

    if (playerClass === "idiota") {
      dmg *= 0.8;
    }

    return Math.round(dmg);
  }

  /**
   * Resolve um hit de NPC contra o player: stats do NPC, defesa/armadura,
   * crítico (com regra especial de Slimita em fase 2) e multiplicador
   * elemental.
   */
  resolveNpcHit({
    npcLevel,
    npcClass,
    playerClass,
    totalArmor,
    difficulty,
    npcType,
    playerCharacter,
    playerLevel = 0,
    npcPhase,
    npcHp,
    npcMaxHp,
  }: NpcHitParams): { finalDmg: number; dmgType: DamageType } {
    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const dmg = this.calculateNpcDamage(npc.damage, playerClass, totalArmor);

    const hpRatio = npcMaxHp > 0 ? npcHp / npcMaxHp : 1;
    const clampedRatio = Math.max(0, Math.min(1, hpRatio));
    let critChance = 1;
    if (npcType === "slimita" && npcPhase >= 2) {
      critChance = 1 + (1 - clampedRatio) * 9;
    }
    const isCrit = Math.random() * 100 < critChance;
    const elementMultiplier = this.getElementMultiplier(
      getNpcElementTypes(npcType),
      getCharacterElementTypesAtLevel(playerCharacter, playerLevel),
    );
    const finalDmg = Math.round((isCrit ? dmg * 2 : dmg) * elementMultiplier);
    const dmgType: DamageType = isCrit ? "crit" : "npc";

    return { finalDmg, dmgType };
  }

  canNpcAttack(
    distanceX: number,
    distanceY: number,
    lastAttack: number,
    cooldown: number,
  ): boolean {
    return (
      distanceX <= 20 && distanceY <= 39 && Date.now() - lastAttack > cooldown
    );
  }

  // --- Elementos / sorte / cooldown ------------------------------------

  /**
   * Multiplicador elemental entre duas criaturas.
   *
   * Cada par (atacante × defensor) contribui `superEffective` ou
   * `notVeryEffective`. Com multi-tipagem o produto cru dispara — 3 colunas
   * fortes dão `1.5³ = 3.375×` — então, por padrão, o resultado passa por média
   * geométrica sobre os pares avaliados. O efeito continua sendo "elemento forte
   * ajuda, elemento fraco atrapalha", mas a vantagem não escala com quantas
   * raças a criatura tem: ela paga em **alcance** (contra 1 coluna é o dobro do
   * valor), não em **potência**.
   */
  getElementMultiplier(
    attackerTypes: readonly ElementType[],
    defenderTypes: readonly ElementType[],
  ): number {
    let multiplier = 1;
    let pairs = 0;

    for (const attacker of attackerTypes) {
      for (const defender of defenderTypes) {
        pairs += 1;
        if (ELEMENT_STRONG_AGAINST[attacker].includes(defender)) {
          multiplier *= this.superEffectiveMultiplier;
        } else if (ELEMENT_WEAK_AGAINST[attacker].includes(defender)) {
          multiplier *= this.notVeryEffectiveMultiplier;
        }
      }
    }

    if (!this.normalizeTypingMultiplier || pairs <= 1) return multiplier;
    return Math.pow(multiplier, 1 / pairs);
  }

  getLuckBonus(totalLuck: number): number {
    if (totalLuck <= 0) return 0;
    return totalLuck / (totalLuck + this.luckK);
  }

  canUse(lastTime: number, cooldown: number): boolean {
    return Date.now() - lastTime >= cooldown;
  }

  // --- Entidades --------------------------------------------------------

  /** HP resultante de um alvo após dano (imutável). */
  applyDamage<T extends Pick<BaseCharacter, "hp">>(target: T, damage: number) {
    return { ...target, hp: Math.max(0, target.hp - damage) };
  }

  /** HP resultante de um alvo após cura, respeitando maxHp (imutável). */
  heal<T extends Pick<BasePlayer, "hp" | "maxHp">>(target: T, amount: number) {
    return { ...target, hp: Math.min(target.maxHp, target.hp + amount) };
  }
}

export const combatService = new CombatService();
