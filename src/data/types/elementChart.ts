import type { ElementType } from "@/utils/types/battle/element";

export const ELEMENT_STRONG_AGAINST: Record<
  ElementType,
  readonly ElementType[]
> = {
  Pyrus: ["Metallum", "Natura"],
  Aquos: ["Pyrus", "Subterra"],
  Subterra: ["Pyrus", "Electricus", "Metallum"],
  Ventus: ["Subterra", "Natura"],
  Darkus: ["Haos", "Nympha", "Umbra", "Psychicus"],
  Electricus: ["Aquos", "Ventus", "Natura"],
  Haos: ["Darkus", "Umbra"],
  Metallum: ["Ventus", "Haos", "Electricus"],
  Natura: ["Aquos", "Subterra"],
  Psychicus: ["Umbra", "Normalis"],
  Nympha: ["Darkus", "Haos", "Draco"],
  Draco: ["Draco", "Normalis"],
  Umbra: ["Darkus", "Haos", "Psychicus", "Nympha"],
  Normalis: [],
};

export const ELEMENT_WEAK_AGAINST: Record<ElementType, readonly ElementType[]> =
  {
    Pyrus: ["Aquos", "Subterra"],
    Aquos: ["Electricus", "Natura"],
    Subterra: ["Ventus", "Natura", "Aquos"],
    Ventus: ["Electricus", "Metallum"],
    Darkus: ["Haos", "Nympha", "Umbra"],
    Electricus: ["Subterra", "Metallum"],
    Haos: ["Darkus", "Umbra"],
    Metallum: ["Pyrus", "Subterra"],
    Natura: ["Pyrus", "Ventus", "Metallum"],
    Psychicus: ["Darkus", "Haos"],
    Nympha: ["Ventus", "Metallum", "Umbra"],
    Draco: ["Haos", "Natura", "Nympha", "Draco"],
    Umbra: ["Ventus", "Umbra"],
    Normalis: ["Psychicus"],
  };
