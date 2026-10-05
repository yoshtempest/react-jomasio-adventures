import {
  ELEMENT_STRONG_AGAINST,
  ELEMENT_WEAK_AGAINST,
} from "@/data/types/elementChart";
import { getArmorFor, NO_ARMOR } from "@/gameRules/battle/damage/armor";
import type { ElementType } from "@/utils/types/battle/element";
import type { DamageArmor, DamageKind } from "@/utils/types/battle/damageKind";
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

  /**
   * `specialStat` é Técnica ou Espírito conforme a natureza do special (ver
   * `SPECIAL_DMG_STAT`): o parametro deixou de se chamar `intelligence`
   * porque hoje não existe mais uma stat única de special.
   */
  calculateSpecialDamage(specialStat: number, playerClass: string | null) {
    let dmg = 18 + specialStat * 3;

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

  /**
   * Ponto único de redução por armadura do jogo.
   *
   * A curva é hiperbólica e saturante (`dmg * 100 / (100 + armadura)`): 100 de
   * armadura corta pela metade, 400 deixa um quinto. O que decide *qual*
   * armadura entra é a natureza do golpe — `physical` e `magical` caem em
   * colunas distintas, `true` não cai em nenhuma e sai ileso.
   *
   * Qualquer caminho de dano que reduza armadura por conta própria está
   * errado: era exatamente isso que mantinha o funil do summon com uma cópia
   * da fórmula.
   */
  applyArmor(
    damage: number,
    kind: DamageKind,
    armor: DamageArmor = NO_ARMOR,
  ): number {
    const value = getArmorFor(kind, armor);
    if (value <= 0) return damage;
    return Math.round((damage * 100) / (100 + value));
  }

  calculateDamageToNpc(
    damage: number,
    kind: DamageKind,
    npcArmor: DamageArmor = NO_ARMOR,
  ): number {
    return this.applyArmor(damage, kind, npcArmor);
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
    kind: DamageKind,
    playerClass: string | null,
    armor: DamageArmor = NO_ARMOR,
  ) {
    let dmg = this.applyArmor(baseDamage, kind, armor);

    if (playerClass === "idiota") {
      dmg *= 0.8;
    }

    return Math.round(dmg);
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
   * tipagens a criatura tem: ela paga em **alcance** (contra 1 coluna é o dobro do
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
