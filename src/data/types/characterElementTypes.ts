import type { ElementType } from "@/utils/types/battle/element";
import {
  CHARACTER_RACES,
  resolveCharacterElementTypes,
} from "@/data/characters/races";

/**
 * Tipagens elementais de cada personagem.
 *
 * Fonte única: a raça do personagem (`CHARACTER_RACES`). A tipagem efetiva
 * é resolvida pela herança racial (e tipagens adicionais/mestiças), não por
 * uma tabela hardcoded. Alterar a raça de um personagem reflete aqui e,
 * por consequência, em toda a batalha.
 */
export const CHARACTER_ELEMENT_TYPES: Record<
  CharacterId,
  readonly ElementType[]
> = Object.fromEntries(
  (Object.keys(CHARACTER_RACES) as CharacterId[]).map((id) => [
    id,
    resolveCharacterElementTypes(CHARACTER_RACES[id]),
  ]),
) as Record<CharacterId, readonly ElementType[]>;
