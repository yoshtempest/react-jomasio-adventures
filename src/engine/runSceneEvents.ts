import { type SceneEvent } from "@/utils/types/maps/sceneEvents";
import { QUESTS } from "@/data/quests";
import { ITEMS } from "@/data/items";
import type { NavigateFunction } from "react-router";

type EventContext = {
  navigate: NavigateFunction;
  location: { pathname: string };

  setShowClassModal?: (v: boolean) => void;

  // 🔥 flags
  setFlag?: (flag: string) => void;
  hasFlag?: (flag: string) => boolean;

  // 🔥 quests
  progressQuest?: (id: string, value: number) => void;
  giveQuest?: (quest: any) => void;
  hasQuest?: (questId: string) => boolean;

  // 🔥 inventory
  addItem?: (item: any) => void;
  removeItem?: (itemId: string) => void;
  hasItem?: (itemId: string) => boolean;
};

export function runSceneEvents(
  events: SceneEvent[] | undefined,
  ctx: EventContext
) {
  if (!events) return;

  for (const event of events) {
    switch (event.type) {
      case "conditional": {
        const {
          hasItem,
          notHasItem,
          hasQuest,
          notHasQuest,
          hasFlag,
          notHasFlag,
        } = event.condition;

        let conditionMet = true;

        if (hasItem) {
          conditionMet &&= !!ctx.hasItem?.(hasItem);
        }

        if (notHasItem) {
          conditionMet &&= !ctx.hasItem?.(notHasItem);
        }

        if (hasQuest) {
          conditionMet &&= !!ctx.hasQuest?.(hasQuest);
        }

        if (notHasQuest) {
          conditionMet &&= !ctx.hasQuest?.(notHasQuest);
        }

        if (hasFlag) {
          conditionMet &&= !!ctx.hasFlag?.(hasFlag);
        }

        if (notHasFlag) {
          conditionMet &&= !ctx.hasFlag?.(notHasFlag);
        }

        runSceneEvents(
          conditionMet ? event.then : event.else,
          ctx
        );
        break;
      }

      case "openModal":
        if (event.modal === "class") {
          ctx.setShowClassModal?.(true);
        }
        break;

      case "navigate":
        ctx.navigate(event.to, {
          state: { from: ctx.location.pathname }
        });
        return; // 🔥 IMPORTANTE: para execução após navegar

      case "setFlag":
        ctx.setFlag?.(event.flag);
        break;

      case "progressQuest":
        ctx.progressQuest?.(event.id, event.value);
        break;

      case "giveQuest": {
        const quest = QUESTS[event.questId];
        ctx.giveQuest?.(quest);
        break;
      }

      case "addItem": {
        const item = ITEMS[event.itemId];
        ctx.addItem?.(item);
        break;
      }

      case "removeItem":
        ctx.removeItem?.(event.itemId);
        break;

      case "log":
        console.log(event.message);
        break;
    }
  }
}