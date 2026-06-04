
export type PlayerState =
  | "idle"
  | "walk"
  | "attack"
  | "jump"
  | "blocked"
  | "special"
  | "preAttack"
  | "preWalk"
  | "preJump"
  | "preSpecial";
export type PlayerMode = "explore" | "battle" | "select" | "ui" | "map";
export const CHARACTERS = ["marcelo", "eduarda", "lucas", "samuel", "artur", "mayra", "lucaua", "riquelme", "larissa", "camilly", "emanuel", "hiago"] as const;
export type Character = typeof CHARACTERS[number];

export function isCharacter(value: unknown): value is Character {
  return typeof value === "string" && (CHARACTERS as readonly string[]).includes(value);
}
export type PlayerClass = "fracote" | "idiota" | "amostradinho" | null;

export type Player = {
    // exploration
    gridX: number;
    gridY: number;
    direction: Direction;
    character: Character;

    // battle
    x: number;
    y: number;
    velY: number;
    groundY: number;
    battleDirection: Direction;
    state: PlayerState;

    // geral
    mode: PlayerMode;
};