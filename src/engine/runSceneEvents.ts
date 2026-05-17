import { type SceneEvent } from "@/utils/types/maps/sceneEvents";
import { QUESTS } from "@/data/quests";
import { ITEMS } from "@/data/items";
import type { NavigateFunction } from "react-router";

type EventContext = {
  navigate: NavigateFunction;
  location: { pathname: string };
  setShowClassModal?: (v: boolean) => void;
  setFlags?: (key: string, value: boolean) => void;
  progressQuest?: (id: string, value: number) => void;
  giveQuest?: (quest: any) => void;
  addItem?: (item: any) => void;
  removeItem?: (itemId: string) => void;

  hasItem?: (itemId: string) => boolean;
  hasQuest?: (questId: string) => boolean;
};

export function runSceneEvents(
  events: SceneEvent[] | undefined,
  ctx: EventContext
) {
  if (!events) return;

  for (const event of events) {
    switch (event.type) {
      case "conditional": {
        const { hasItem, hasQuest } = event.condition;

        let conditionMet = true;

        if (hasItem) {
          conditionMet = conditionMet && !!ctx.hasItem?.(hasItem);
        }

        if (hasQuest) {
          conditionMet = conditionMet && !!ctx.hasQuest?.(hasQuest);
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
        break;

      case "setFlag":
        ctx.setFlags?.(event.key, event.value);
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

        ctx.addItem?.(item); // 👈 agora correto
        break;
      }

      case "removeItem":
        ctx.removeItem?.(event.itemId);
        break;

      case "log":
        break;
    }
  }
}