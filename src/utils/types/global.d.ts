import { QUESTS } from "@/data/quests";
import { ITEMS } from "@/data/items";
import { FLAGS } from "@/data/flags";

export {};

declare global {
    type LastPage = string | undefined;

    type Direction = "up" | "down" | "left" | "right";

    type ExplorePosition = {
        x: number;
        y: number;
        direction: Direction;
    };

    type PlayerPosition = {
        gridX: number;
        gridY: number;
        direction: Direction;
    };

    type playerState = string;

    type QuestId = Extract<keyof typeof QUESTS, string>;
    type ItemId = Extract<keyof typeof ITEMS, string>;
    type EquipmentId = string;
    type FlagId = Extract<keyof typeof FLAGS, string>;

    type CharacterId = 
        | "marcelo"
        | "eduarda"
        | "samuel"
        | "artur"
        | "emanuel"
        | "larissa"
        | "mayra"
        | "camilly"
        | "lucas"
        | "lucaua"
        | "riquelme"
        | "hiago";
}