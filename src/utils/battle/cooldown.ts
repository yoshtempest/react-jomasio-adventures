import type { RefObject } from "react";

/**
 * Reinicia um cooldown em ref de batalha: trava agora (`false`) e libera
 * (`true`) ao fim de `cooldownMs` — padrão compartilhado pelo player e NPC.
 */
export function resetCooldownRef(cooldownMs: number, ref: RefObject<boolean>) {
  ref.current = false;
  setTimeout(() => {
    ref.current = true;
  }, cooldownMs);
}
