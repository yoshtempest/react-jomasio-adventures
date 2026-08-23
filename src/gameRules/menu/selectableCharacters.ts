import { CHARACTERS } from "@/data/options/characters";

type UnlockFlags = {
  samurionUnlocked: boolean;
  yvelUnlocked: boolean;
  srGuaxinimUnlocked: boolean;
};

export function getSelectableCharacters(flags: UnlockFlags) {
  return CHARACTERS.filter(
    (c) =>
      c.selectable ||
      (c.image === "samuel" && flags.samurionUnlocked) ||
      (c.image === "lucas" && flags.yvelUnlocked) ||
      (c.image === "artur" && flags.srGuaxinimUnlocked),
  );
}
