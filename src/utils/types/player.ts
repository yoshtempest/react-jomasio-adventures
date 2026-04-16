export type DirectionExplore = "up" | "down" | "left" | "right";
export type DirectionBattle = "up" | "down" | "left" | "right";

export type PlayerState = "idle" | "walk" | "attack" | "jump" | "crouched" | "special";
export type PlayerMode = "explore" | "battle";
export type Character = "marcelo" | "eduarda" | "lucas" | "samuel" | "artur" | "mayra" | "lucaua" | "riquelme" | "larissa" | "camilly" | "emanuel";

export type Player = {
    // exploration
    gridX: number;
    gridY: number;
    direction: DirectionExplore;
    character: Character;


    // battle
    x: number;
    y: number;
    battleDirection: DirectionBattle;
    state: PlayerState;

    // geral
    mode: PlayerMode;
};