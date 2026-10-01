import { asset } from "./asset";
import type { MarceloBattleForm } from "./types";

/**
 * Background de abertura (`SpecialIntro`) de uma habilidade de personagem:
 * `inFight/<forma>/habilities/<ability>/background.svg`.
 *
 * A forma entra no caminho porque as habilidades não vivem todas na pasta
 * `default/` — as liberadas na Forma Vastolord do marcelo (o laser) ficam em
 * `vastolordForm/`, igual aos sprites (veja `resolveBattleSprite`).
 */
export function playerAbilityBackgroundPath(
  character: string,
  ability: string,
  form: MarceloBattleForm = "default",
) {
  return asset(
    `/assets/player/${character}/inFight/${form}/habilities/${ability}/background.svg`,
  );
}
