import type { DamageKind } from "@/utils/types/battle/damageKind";

/**
 * Opções do `specialHit` para golpes de área que são a **cauda** de um special já
 * disparado (explosão das bombas do Killer Queen).
 */
export type SpecialHitOptions = {
  /**
   * Trata o hit como continuação do special que já consumiu a carga e o
   * cooldown: não reprova no gate de delícia, não rearma o cooldown e não conta
   * um special extra nas stats. O dano em si é o mesmo pipeline.
   */
  bypassCharge?: boolean;
  /**
   * Natureza do golpe, para golpes que reaproveitam o special mas têm outra
   * origem (a Explosão do I Am Atomic é mágica mesmo sendo empurrada pelo
   * special). Ausente = física, como o special do botão.
   */
  damageKind?: DamageKind;
};
