/**
 * Status elementais/comportamentais do player.
 *
 * Vive em `utils/types` (e não junto das regras de status) porque é a base da
 * camada `utils`: as regras de status ficam em `gameRules` e não podem ser
 * importadas de volta por quem só precisa do nome do status.
 */
export type PlayerStatus =
  "bleed" | "burn" | "poison" | "paralyze" | "blind" | "confuse" | "freeze";

/** Status que o jogo consegue aplicar em uma criatura (sangramento é próprio). */
export type NewPlayerStatus = Exclude<PlayerStatus, "bleed">;
