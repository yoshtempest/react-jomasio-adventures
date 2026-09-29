/**
 * Botão de combo que aparece sobre o jogador durante a batalha: cada estado
 * "de espera" tem um golpe encadeável (contra-ataque ao sair do bloqueio,
 * golpe aéreo ao cair). Fonte única para o botão (`ComboAction`) e para o
 * snapshot de replay (`useBattleSnapshots`).
 */
export type ComboActionConfig = {
  /** Estado enviado ao `resolveBattleSprite` para desenhar o botão. */
  sprite: PlayerState;
  label: string;
};

export const COMBO_ACTIONS: Partial<Record<PlayerState, ComboActionConfig>> = {
  blocked: { sprite: "blockAttack", label: "Atacar" },
  falling: { sprite: "fallingAttack", label: "Atacar" },
};

export function getComboAction(state: PlayerState): ComboActionConfig | null {
  return COMBO_ACTIONS[state] ?? null;
}
