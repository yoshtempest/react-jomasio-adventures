/**
 * Tipos do ataque básico do lucaua: o golpe é um projétil de energia
 * (`energyAttack.svg`) disparado da mão — uma mão por vez (alternando entre
 * `leftHandAttack`/`rightHandAttack`) ou as duas (`bothSidesAttack`) quando há
 * inimigos dos dois lados do player.
 */

/** Variante do básico do lucaua: pose da mão do sprite de ataque. */
export type LucauaAttackVariant = "left" | "right" | "both";

/** Lado do shield de bloqueio do lucaua: espelha o lado de quem ataca. */
export type LucauaShieldSide = "left" | "right";

/**
 * Shield de bloqueio por lado. O valor é um nonce: `0` = inativo, `> 0` = ativo.
 * Cada golpe bloqueado incrementa o nonce do lado para remontar o sprite e
 * reexecutar a animação de surgimento (o "blink").
 */
export type LucauaShieldSides = Record<LucauaShieldSide, number>;

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