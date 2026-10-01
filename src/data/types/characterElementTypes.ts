import type { ElementType } from "@/utils/types/battle/element";
import {
  CHARACTER_RACES,
  applyAwakening,
  resolveCharacterElementTypes,
} from "@/data/characters/races";

const CHARACTER_IDS = Object.keys(CHARACTER_RACES) as CharacterId[];

/**
 * Tipagens elementais de cada personagem.
 *
 * Fonte única: a raça do personagem (`CHARACTER_RACES`). A tipagem efetiva
 * é resolvida pela herança racial (e tipagens adicionais/mestiças), não por
 * uma tabela hardcoded. Alterar a raça de um personagem reflete aqui e,
 * por consequência, em toda a batalha.
 *
 * Esta é a versão **sem** despertar — serve para UI que não conhece o nível
 * do personagem (cards, fichas). Todo caminho que resolve dano tem que usar
 * `getCharacterElementTypesAtLevel`, senão o despertar só existiria no texto.
 */
export const CHARACTER_ELEMENT_TYPES: Record<
  CharacterId,
  readonly ElementType[]
> = CHARACTER_IDS.reduce(
  (acc, id) => {
    acc[id] = resolveCharacterElementTypes(CHARACTER_RACES[id]);
    return acc;
  },
  {} as Record<CharacterId, ElementType[]>,
);

/**
 * Tipagens efetivas no nível dado (herança racial + despertar).
 *
 * É a função que o combate usa: sem o nível, não dá para saber se o despertar
 * já venceu.
 */
export function getCharacterElementTypesAtLevel(
  character: CharacterId,
  level: number,
): ElementType[] {
  return applyAwakening(
    resolveCharacterElementTypes(CHARACTER_RACES[character]),
    character,
    level,
  );
}
