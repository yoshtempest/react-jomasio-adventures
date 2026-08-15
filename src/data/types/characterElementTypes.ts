import type { ElementType } from "@/utils/types/battle/element";

export const CHARACTER_ELEMENT_TYPES: Record<
  CharacterId,
  readonly ElementType[]
> = {
  marcelo: ["Normalis", "Ventus"],
  eduarda: ["Normalis", "Haos"],
  lucas: ["Normalis", "Subterra"],
  samuel: ["Subterra", "Darkus"],
  artur: ["Pyrus", "Psychicus"],
  mayra: ["Darkus", "Umbra"],
  lucaua: ["Metallum", "Normalis"],
  riquelme: ["Aquos", "Subterra"],
  larissa: ["Metallum", "Electricus"],
  camilly: ["Normalis", "Subterra"],
  emanuel: ["Ventus", "Electricus"],
  hiago: ["Nympha", "Natura"],
};
