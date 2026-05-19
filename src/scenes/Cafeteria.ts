import { cafeteria } from "@/maps/cafeteria/one";
import { cafeteriaTwo } from "@/maps/cafeteria/two";
import { cafeteriaThree } from "@/maps/cafeteria/three";
import { cafeteriaDialogue } from "@/data/maps/cafeteria/one";
import { cafeteriaTwoDialogue } from "@/data/maps/cafeteria/two";
import { cafeteriaThreeDialogue } from "@/data/maps/cafeteria/three";

import LavenderTown from "/assets/songs/LavenderTown.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const CAFETERIA_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: cafeteria,
    dialogueData: cafeteriaDialogue,
    initialPosition: { x: 9, y: 10, direction: "up" },
    npcs: [
      { src: "/assets/npcs/deise/default.svg", gridX: 14, gridY: 5 }
    ],
    audio: { src: LavenderTown },

    events: [
      { type: "navigate", to: "/cafeteria/battle" }
    ],
    exitTile: [
      {
        x: 8,
        y: 11,
        route: "/cantina/four",
      },
    ],
  },

  two: {
    id: "two",
    map: cafeteria,
    dialogueData: cafeteriaTwoDialogue,
    audio: { src: LavenderTown },
    npcs: [
      { src: "/assets/npcs/deise/default.svg", gridX: 14, gridY: 5 }
    ],
    events: [
      {
        type: "giveQuest",
        questId: "return_to_remedinha",
      },
      {
        type: "giveQuest",
        questId: "encounter_deise",
      },
      {
        type: "navigate",
        to: "/cafeteria/three"
      }
    ],
  },

  three: {
    id: "three",
    map: cafeteriaTwo,
    dialogueData: cafeteriaThreeDialogue,
    npcs: [
      { src: "/assets/npcs/denis/default.svg", gridX: 12, gridY: 5 },
      { src: "/assets/npcs/deise/default.svg", gridX: 14, gridY: 5 }
    ],
    events: [
      { type: "navigate", to: "/cafeteria/four" }
    ],
    audio: { src: LavenderTown },
    initialPosition: { x: 13, y: 5, direction: "right" },
  },
  four: {
    id: "four",
    map: cafeteriaThree,
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      if (lastPage?.startsWith("/cafeteria")) {
        return { x: 13, y: 5, direction: "right" as const };
      }

      return { x: 9, y: 11, direction: "up" as const };
    },
    exitTile: [
      {
        x: 8,
        y: 11,
        route: "/cantina/four",
      },
    ],
  },
};