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

export type CharacterId = (typeof CHARACTERS)[number];

export const DEFAULT_CHARACTER: CharacterId = "marcelo";

export function isCharacter(value: unknown): value is CharacterId {
  return (
    typeof value === "string" &&
    (CHARACTERS as readonly string[]).includes(value)
  );
}
