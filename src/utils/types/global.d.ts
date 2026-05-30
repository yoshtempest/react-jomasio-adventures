export {};

declare global {
    type LastPage = string | undefined;

    type Direction = "up" | "down" | "left" | "right";

    type ExplorePosition = {
        x: number;
        y: number;
        direction: DirectionExplore;
    };

    type Character = "marcelo" | "eduarda" | "lucas" | "samuel" | "artur" | "mayra" | "lucaua" | "riquelme" | "larissa" | "camilly" | "emanuel" | "hiago";

    type PlayerPosition = {
        gridX: number;
        gridY: number;
        direction: Direction;
    };

    type playerState = string;
}