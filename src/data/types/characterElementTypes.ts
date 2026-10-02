import type { ElementType } from "@/utils/types/battle/element";

/**
 * Tipagens elementais de cada personagem.
 *
 * Fonte única e literal: a lista é a tipagem do personagem. Alterar a tipagem
 * de um personagem reflete aqui e, por consequência, em toda a batalha.
 *
 * Não há progressão elemental: a lista vale do nível 1 ao fim do jogo.
 */
export const CHARACTER_ELEMENT_TYPES = {
  marcelo: ["Normalis", "Darkus"],
  eduarda: ["Normalis", "Haos"],
  lucas: ["Normalis"],
  samuel: ["Normalis", "Subterra"],
  artur: ["Normalis", "Darkus", "Umbra"],
  mayra: ["Normalis", "Aquos", "Umbra"],
  lucaua: ["Normalis", "Metallum", "Psychicus"],
  riquelme: ["Normalis", "Haos", "Darkus"],
  larissa: ["Normalis", "Metallum", "Electricus"],
  camilly: ["Normalis"],
  emanuel: ["Normalis", "Ventus", "Electricus"],
  levi: ["Normalis", "Draco"],
} as const satisfies Record<CharacterId, readonly ElementType[]>;

/** Tipagem elemental do personagem — o que o funil de dano e a UI leem. */
export function getCharacterElementTypes(
  character: CharacterId,
): readonly ElementType[] {
  return CHARACTER_ELEMENT_TYPES[character];
}
