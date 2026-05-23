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
import type { QuestId } from "@/data/quests";

export const CAFETERIA_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: cafeteria,
    dialogueData: (quests) => {
    const hasQuest = (id: QuestId) =>
      quests.some(q => q.id === id);
      if (hasQuest("x1_deise")) {
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
        condition: { notHasFlag: "deise_intro_done" },
        then: [
          { type: "giveQuest", questId: "x1_deise" },
          { type: "navigate", to: "/cafeteria/battle" },
        ],
        else: [
          {
            type: "conditional",
            condition: { hasQuest: "x1_deise" },
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
                type: "progressQuest",
                id: "x1_deise", value: 1
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
    tiles: [
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
      { type: "giveQuest", questId: "denis_sausage", },
      { type: "navigate", to: "/cafeteria/three" }
    ],
    audio: { src: LavenderTown },
    initialPosition: { x: 13, y: 5, direction: "right" },
  },
  three: {
    id: "three",
    map: cafeteriaThree,
    audio: { src: LavenderTown },
    npcs: [
      { src: "/assets/npcs/denis/default.svg", gridX: 12, gridY: 5 },
    ],
    dialogueData: (_quests, items) => {
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
          { type: "progressQuest", id: "denis_sausage", value: 1 },
          { type: "navigate", to: "/cafeteria/four" },
          { type: "removeItem", itemId: "sausage" },
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
        return { x: 13, y: 5, direction: "left" as const };
      }

      return { x: 9, y: 11, direction: "up" as const };
    },
    tiles: [
      {
        x: 8,
        y: 11,
        route: "/cantina/two",
      },
    ],
  },
};