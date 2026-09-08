import type { CharacterOption } from "@/utils/types/player/character";
import type { CharacterId } from "@/data/characters/list";

export const CHARACTERS: CharacterOption[] = [
  { name: "Marshadow", image: "marcelo", selectable: true },
  { name: "Drika", image: "eduarda", selectable: true },
  { name: "Samurion", image: "samuel", selectable: true },
  { name: "Sr. Guaxinim", image: "artur", selectable: true },
  { name: "Ematron", image: "emanuel", selectable: true },
  { name: "Laricell", image: "larissa", selectable: true },
  { name: "Y.R.A", image: "mayra", selectable: true },
  { name: "Camy Kaze", image: "camilly", selectable: true },
  { name: "Yvel", image: "lucas", selectable: true },
  { name: "Babidi n.º 78==Dζ3", image: "lucaua", selectable: true },
  { name: "Natsuki", image: "riquelme", selectable: true },
  { name: "Levi", image: "levi", selectable: true },
];

export function getCharacterName(id: CharacterId): string {
  return CHARACTERS.find((c) => c.image === id)?.name ?? id;
}
