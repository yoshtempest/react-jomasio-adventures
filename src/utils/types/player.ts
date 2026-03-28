export type DirectionExplore = "up" | "down" | "left" | "right";
export type DirectionBattle = "left" | "right";

export type PlayerState = "idle" | "walk" | "punch";
export type PlayerMode = "explore" | "battle";

export type Player = {
    // exploration
    gridX: number;
    gridY: number;
    direction: DirectionExplore;

    // battle
    x: number;
    y: number;
    battleDirection: DirectionBattle;
    state: PlayerState;

    // geral
    mode: PlayerMode;
};