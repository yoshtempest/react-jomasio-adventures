/**
 * Fundação de entidades de batalha (absorvida da antiga src/core).
 * Base para regras de combate dos services.
 */

export type NpcBehavior = "attack" | "walk" | "idle";
export type PlayerBehavior = "idle" | "attack" | "blocked" | "jump" | "walk";

export interface BaseCharacterProps {
  hp: number;
  name: string;
  image: string;
  level?: number;
  range?: number;
  damage?: number;
  cooldown?: number;
}

export interface BaseNPCProps extends BaseCharacterProps {
  behavior: NpcBehavior;
}

export interface BasePlayerProps extends BaseCharacterProps {
  behavior: PlayerBehavior;
  specialCharge?: number;
  specialChargeLimit?: number;
}

export class BaseCharacter {
  hp: number;
  maxHp: number;
  name: string;
  image: string;
  level: number;
  range: number;
  damage: number;
  cooldown: number;
  lastHitTime: number;

  constructor(props: BaseCharacterProps) {
    this.hp = props.hp;
    this.maxHp = props.hp;
    this.name = props.name;
    this.image = props.image;
    this.level = props.level ?? 1;
    this.range = props.range ?? 1;
    this.damage = props.damage ?? 10;
    this.cooldown = props.cooldown ?? 1;
    this.lastHitTime = Date.now() - this.cooldown;
  }

  takeDamage(damage: number) {
    this.hp = Math.max(0, this.hp - damage);
  }

  heal(hp: number) {
    this.hp = Math.min(this.maxHp, this.hp + hp);
  }

  canHit(): boolean {
    return Date.now() - this.lastHitTime >= this.cooldown;
  }
}

export class BaseNPC extends BaseCharacter {
  behavior: NpcBehavior;

  constructor(props: BaseNPCProps) {
    super(props);

    this.behavior = props.behavior;
  }
}

export class BasePlayer extends BaseCharacter {
  behavior: PlayerBehavior;
  specialCharge: number;
  specialChargeLimit: number;

  constructor(props: BasePlayerProps) {
    super(props);

    this.behavior = props.behavior;
    this.specialCharge = props.specialCharge ?? 0;
    this.specialChargeLimit = props.specialChargeLimit ?? 6;
  }

  chargeSpecial(amount: number) {
    this.specialCharge = Math.min(
      this.specialCharge + amount,
      this.specialChargeLimit,
    );
  }

  resetSpecial() {
    this.specialCharge = 0;
  }

  block() {
    this.behavior = "blocked";
  }

  jump() {
    this.behavior = "jump";
  }

  takeDamage(damage: number) {
    if (this.behavior === "blocked" || this.behavior === "jump") {
      return;
    }
    this.hp = Math.max(0, this.hp - damage);
  }
}
