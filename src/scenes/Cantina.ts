import { cantina } from "@/maps/cantina/one";
import { cantinaFour } from "@/maps/cantina/four";

import { cantinaDialogue } from "@/data/maps/cantina/one";
import { cantinaTwoDialogue } from "@/data/maps/cantina/two";
import { cantinaThreeDialogue } from "@/data/maps/cantina/three";

import LavenderTown from "@/assets/songs/LavenderTown.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const CANTINA_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: cantina,
    dialogueData: cantinaDialogue,
    initialPosition: { x: 8, y: 11, direction: "up" },
    npcs: [
      { src: "/src/assets/npcs/jhowsimar/default.svg", gridX: 9, gridY: 4 }
    ],
    audio: { src: LavenderTown },

    events: [
      { type: "navigate", to: "/director/one" }
    ],
  },

  two: {
    id: "two",
    map: cantina,
    dialogueData: cantinaTwoDialogue,
    audio: { src: LavenderTown },
    initialPosition: { x: 10, y: 4, direction: "up" },
    npcs: [
      { src: "/src/assets/npcs/jhowsimar/default.svg", gridX: 9, gridY: 4 }
    ],
    events: [
      { type: "navigate", to: "/cantina/battle" }
    ],
  },

  three: {
    id: "three",
    map: cantina,
    dialogueData: cantinaThreeDialogue,
    audio: { src: LavenderTown },
    initialPosition: { x: 9, y: 5, direction: "up" },
    npcs: [
      { src: "/src/assets/npcs/jhowsimar/default.svg", gridX: 9, gridY: 4 }
    ],
    events: [
      {
        type: "giveQuest",
        questId: "explore_jorjao",
      },
      { type: "navigate", to: "/cantina/four" }
    ],
  },

  four: {
    id: "four",
    map: cantinaFour,
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      if (lastPage === "/hall/one") {
        return { x: 14, y: 11, direction: "left" as const };
      }

      return { x: 9, y: 5, direction: "up" as const };
    },
    exitTile: [
    {
      x: 15,
      y: 11,
      route: "/hall/one",
    },
    {
      x: 6,
      y: 2,
      route: "/cafeteria/one",
      requiredQuest: "go_cafeteria",
      blockedMessage: "Ainda não é o momento..."
    }
  ],
  },
};