import { cantina } from "@/maps/cantina/one";
import { cantinaFour } from "@/maps/cantina/four";

import { cantinaDialogue } from "@/data/maps/cantina/one";
import { cantinaTwoDialogue } from "@/data/maps/cantina/two";
import { cantinaThreeDialogue } from "@/data/maps/cantina/three";

import LavenderTown from "/assets/songs/LavenderTown.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";
import type { QuestId } from "@/data/quests";

export const CANTINA_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: cantina,
    dialogueData: (quests, _items, lastPage) => {
      const hasQuest = (id: QuestId) =>
        quests.some(q => q.id === id);

      const isLastPage = (path: string) =>
        lastPage === path;

      if (hasQuest("director_escape") && !hasQuest("explore_jorjao")) {
        return cantinaTwoDialogue;
      }

      if (isLastPage("/cantina/battle")) {
        return cantinaThreeDialogue;
      }
  
      return cantinaDialogue;
    },
    initialPosition: (lastPage?: string) => {
      if (
        lastPage === "/director/two"
       ) {
        return { x: 10, y: 4, direction: "down" as const };
      }
      if (
        lastPage === "/cantina/battle"
      ) {
        return { x: 9, y: 5, direction: "up" as const };
      }

      return { x: 8, y: 11, direction: "up" as const };
    },
    npcs: [
      { src: "/assets/npcs/jhowsimar/default.svg", gridX: 9, gridY: 4 }
    ],
    audio: { src: LavenderTown },
    events: [
      {
        type: "conditional",
        condition: { notHasQuest: "director_escape" },
        then: [
          { type: "navigate", to: "/director/one" }
        ],
        else: [
          {
            type: "conditional",
            condition: { notHasFlag: "cantina_battle_done" },
            then: [
              { type: "navigate", to: "/cantina/battle" }
            ],
            else: [
              { type: "navigate", to: "/cantina/two" }
            ]
          }
        ]
      }
    ]
  },
  two: {
    id: "two",
    map: cantinaFour,
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      if (
        lastPage === "/hall/one" ||
        lastPage === "/hall/afterpcroom-one"
      ) {
        return { x: 14, y: 11, direction: "left" as const };
      }

      if (lastPage === "/hall/center-one") {
        return { x: 2, y: 11, direction: "right" as const };
      }
      if (lastPage?.startsWith("/cafeteria")) {
        return { x: 6, y: 3, direction: "down" as const };
      }

      return { x: 9, y: 5, direction: "up" as const };
    },
    exitTile: [
      {
        x: 1,
        y: 11,
        route: "/hall/center-one",
        requiredQuest: "search_packaging",
        blockedMessage: "Ainda não é o momento..."
      },
      {
        x: 11,
        y: 4,
        route: "/director/two",
      }
    ],
    tiles: [
      {
        x: 6,
        y: 2,
        getRoute: (_player, quests) => {
          if (quests.some(q => q.id === "encounter_deise")) {
            return "/cafeteria/three";
          } else if (quests.some(q => q.id === "go_cafeteria")) {
            return "/cafeteria/one";
          }
          return null;
        },
        blockedMessage: "Ainda não é o momento..."
      },
      {
        x: 15,
        y: 11,
        getRoute: (_player, quests) => {
          if (quests.some(q => q.id === "explore_jorjao")) {
            return "/hall/afterpcroom-one";
          }
          return "/hall/one";
        },
      }
    ]
  },
};