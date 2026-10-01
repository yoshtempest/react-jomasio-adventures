/**
 * Status elementais/comportamentais do player.
 *
 * Vive em `utils/types` (e não junto das regras de status) porque traits
 * raciais em `data/` precisam citar os status para declarar imunidades — e a
 * camada `data` não pode importar `gameRules`.
 */
export type PlayerStatus =
  "bleed" | "burn" | "poison" | "paralyze" | "blind" | "confuse" | "freeze";

/** Status que o jogo consegue aplicar em uma criatura (sangramento é próprio). */
export type NewPlayerStatus = Exclude<PlayerStatus, "bleed">;
