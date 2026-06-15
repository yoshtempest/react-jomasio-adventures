export const CHARACTERS = [
  "marcelo",
  "eduarda",
  "lucas",
  "samuel",
  "artur",
  "mayra",
  "lucaua",
  "riquelme",
  "larissa",
  "camilly",
  "emanuel",
  "hiago",
] as const;
export type Character = (typeof CHARACTERS)[number];

export function isCharacter(value: unknown): value is Character {
  return (
    typeof value === "string" &&
    (CHARACTERS as readonly string[]).includes(value)
  );
}
