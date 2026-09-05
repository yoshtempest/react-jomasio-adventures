import { TWO_THOUSAND_MS } from "@/data/ms";

export const CHARGE_TIME = TWO_THOUSAND_MS;

/** Nível do personagem em uso a partir do qual o ataque carregado é liberado. */
export const CHARGE_ATTACK_MIN_LEVEL = 15;

export type ChargeParticle = {
  id: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  offsetX: number;
  offsetY: number;
};
