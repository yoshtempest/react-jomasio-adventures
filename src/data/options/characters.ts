import type { CharacterOption } from "@/utils/types/player/character";
import type { CharacterId } from "@/data/characters/list";

export const CHARACTERS: CharacterOption[] = [
  { name: "Marshadow", image: "marcelo", selectable: true },
  { name: "Drika", image: "eduarda", selectable: true },
  { name: "Samurion", image: "samuel", selectable: false },
  { name: "Sr. Guaxinim", image: "artur", selectable: false },
  { name: "Ematron", image: "emanuel", selectable: false },
  { name: "Laricell", image: "larissa", selectable: false },
  { name: "Y.R.A", image: "mayra", selectable: false },
  { name: "Camy Kaze", image: "camilly", selectable: false },
  { name: "Yvel", image: "lucas", selectable: false },
  { name: "Babidi n.º 78==Dζ3", image: "lucaua", selectable: false },
  { name: "Natsuki", image: "riquelme", selectable: false },
  { name: "Levi", image: "levi", selectable: false },
];

export function getCharacterName(id: CharacterId): string {
  return CHARACTERS.find((c) => c.image === id)?.name ?? id;
}
