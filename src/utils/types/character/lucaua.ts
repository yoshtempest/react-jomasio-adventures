/**
 * Tipos do ataque básico do lucaua: o golpe é um projétil de energia
 * (`energyAttack.svg`) disparado da mão — uma mão por vez (alternando entre
 * `leftHandAttack`/`rightHandAttack`) ou as duas (`bothSidesAttack`) quando há
 * inimigos dos dois lados do player.
 */

/** Variante do básico do lucaua: pose da mão do sprite de ataque. */
export type LucauaAttackVariant = "left" | "right" | "both";

/** Alvo do projétil de energia (NPC principal ou summon inimigo vivo). */
export type LucauaTarget = {
  id: string;
  x: number;
  y: number;
};

/** Projétil de energia do ataque básico do lucaua em voo. */
export type LucauaEnergyProjectile = {
  id: string;
  x: number;
  y: number;
  /** Direção do voo: 1 = direita, -1 = esquerda (o sprite espelha nesse caso). */
  dirX: 1 | -1;
};