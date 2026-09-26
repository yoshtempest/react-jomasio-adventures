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
};
