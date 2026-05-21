import { cafeteria } from "@/maps/cafeteria/one";
import { cafeteriaTwo } from "@/maps/cafeteria/two";
import { cafeteriaThree } from "@/maps/cafeteria/three";
import { cafeteriaFour } from "@/maps/cafeteria/four";

import { cafeteriaDialogue } from "@/data/maps/cafeteria/one";
import { cafeteriaTwoDialogue } from "@/data/maps/cafeteria/two";
import { cafeteriaThreeDialogue } from "@/data/maps/cafeteria/three";
import { cafeteriaFourDialogue } from "@/data/maps/cafeteria/four";
import { cafeteriaFiveDialogue } from "@/data/maps/cafeteria/five";

import LavenderTown from "/assets/songs/LavenderTown.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const CAFETERIA_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: cafeteria,
    dialogueData: (quests, items, lastPage) => {

      const isLastPage = (path: string) =>
        lastPage === path;

      if (isLastPage("/cafeteria/battle")) {
        return cafeteriaTwoDialogue;
      }
  
      return cafeteriaDialogue;
    },
    initialPosition: (lastPage?: string) => {
      if (
        lastPage === "/cafeteria/battle"
      ) {
        return { x: 13, y: 5, direction: "right" as const };
      }

      return { x: 9, y: 10, direction: "up" as const };
    },
    npcs: [
      { src: "/assets/npcs/deise/default.svg", gridX: 14, gridY: 5 }
    ],
    audio: { src: LavenderTown },
    events: [
      {
        type: "conditional",
        condition: { notHasQuest: "return_to_remedinha" },
        then: [
          { type: "navigate", to: "/cafeteria/battle" },
        ],
        else: [
          {
            type: "conditional",
            condition: { lastPage: "/cafeteria/battle" },
            then: [
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
                to: "/cafeteria/two"
              }
            ],
          }
        ]
      }
    ],
    exitTile: [
      {
        x: 8,
        y: 11,
        route: "/cantina/two",
      },
    ],
  },

  two: {
    id: "two",
    map: cafeteriaTwo,
    dialogueData: cafeteriaThreeDialogue,
    npcs: [
      { src: "/assets/npcs/denis/default.svg", gridX: 12, gridY: 5 },
      { src: "/assets/npcs/deise/default.svg", gridX: 14, gridY: 5 }
    ],
    events: [
      { type: "navigate", to: "/cafeteria/three" }
    ],
    audio: { src: LavenderTown },
    initialPosition: { x: 13, y: 5, direction: "right" },
  },
  three: {
    id: "three",
    map: cafeteriaThree,
    audio: { src: LavenderTown },
    dialogueData: (items) => {
      const hasItem = (id: string) =>
        items.some(item => item.id === id);

      if (hasItem("sausage")) {
        return cafeteriaFiveDialogue;
      }
      return cafeteriaFourDialogue;
    },
    events: [
      {
        type: "conditional",
        condition: { hasItem: "sausage" },
        then: [
          { type: "removeItem", itemId: "sausage" },
          { type: "navigate", to: "/cafeteria/four" },
        ],
      }
    ],
    initialPosition: { x: 13, y: 5, direction: "left" },
  },
  four: {
    id: "four",
    map: cafeteriaFour,
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
        route: "/cantina/two",
      },
    ],
  },
};