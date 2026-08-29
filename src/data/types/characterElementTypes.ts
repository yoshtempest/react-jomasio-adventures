import type { ElementType } from "@/utils/types/battle/element";

export const CHARACTER_ELEMENT_TYPES: Record<
  CharacterId,
  readonly ElementType[]
> = {
  marcelo: ["Aquos", "Ventus"],
  eduarda: ["Normalis", "Haos"],
  lucas: ["Pyrus", "Subterra"],
  samuel: ["Subterra", "Darkus"],
  artur: ["Darkus", "Umbra"],
  mayra: ["Darkus", "Umbra"],
  lucaua: ["Metallum", "Psychicus"],
  riquelme: ["Aquos", "Umbra"],
  larissa: ["Metallum", "Electricus"],
  camilly: ["Normalis", "Subterra"],
  emanuel: ["Ventus", "Electricus"],
  levi: ["Draco", "Haos", "Darkus"],
};
