import { type SceneEvent } from "@/utils/types/maps/sceneEvents";
import type { NavigateFunction } from "react-router";

type EventContext = {
  navigate: NavigateFunction;
  location: { pathname: LastPage };

  setShowClassModal?: (v: boolean) => void;

  // 🔥 flags
  setFlag?: (flag: FlagId) => void;
  hasFlag?: (flag: FlagId) => boolean;

  // 🔥 quests
  progressQuest?: (id: QuestId, value: number) => void;
  giveQuest?: (quest: QuestId) => void;
  hasQuest?: (questId: QuestId) => boolean;

  // 🔥 inventory
  addItem?: (item: ItemId) => void;
  removeItem?: (itemId: ItemId) => void;
  hasItem?: (itemId: ItemId) => boolean;
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
        ctx.setFlag?.(event.flagId);
        break;

      case "progressQuest":
        ctx.progressQuest?.(event.id, event.value);
        break;

      case "giveQuest": {
        ctx.giveQuest?.(event.questId);
        break;
      }

      case "addItem": {
        ctx.addItem?.(event.itemId);
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