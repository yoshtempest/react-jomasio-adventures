// hooks/scene/useSceneEvents.ts

import { useLocation, useNavigate } from "react-router";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useFlags } from "@/contexts/FlagContext";

import { QUESTS, type QuestId } from "@/data/quests";
import { ITEMS, type ItemId } from "@/data/items";

import type { SceneEvent } from "@/utils/types/maps/sceneEvents";
import type { FlagId } from "@/data/flags";

type Condition = {
    hasItem?: ItemId;
    notHasItem?: ItemId;
    hasQuest?: QuestId;
    notHasQuest?: QuestId;
    hasFlag?: FlagId;
    notHasFlag?: FlagId;
    lastPage?: LastPage;
    notLastPage?: LastPage;
};

export function useSceneEvents() {
  const navigate = useNavigate();
  const location = useLocation();

  const { items, addItem, removeItem } = useInventory();
  const { quests, addQuest, updateProgress } = useQuests();
  const { setFlag, hasFlag } = useFlags();

  const lastPage = location.state?.from;

  const checkCondition = (condition: Condition) => {
    if (
      condition.hasQuest &&
      !quests.some((q) => q.id === condition.hasQuest)
    ) {
      return false;
    }

    if (
      condition.notHasQuest &&
      quests.some((q) => q.id === condition.notHasQuest)
    ) {
      return false;
    }

    if (
      condition.hasItem &&
      !items.some((i) => i.id === condition.hasItem)
    ) {
      return false;
    }

    if (
      condition.notHasItem &&
      items.some((i) => i.id === condition.notHasItem)
    ) {
      return false;
    }

    if (
      condition.lastPage &&
      lastPage !== condition.lastPage
    ) {
      return false;
    }

    if (
      condition.notLastPage &&
      lastPage === condition.notLastPage
    ) {
      return false;
    }

    if (
      condition.hasFlag &&
      !hasFlag(condition.hasFlag)
    ) {
      return false;
    }

    if (
      condition.notHasFlag &&
      hasFlag(condition.notHasFlag)
    ) {
      return false;
    }

    return true;
  };

  const runEvent = (event: SceneEvent) => {
    switch (event.type) {
      case "navigate":
        setTimeout(() => {
          navigate(event.to, {
            state: { from: location.pathname },
          });
        }, 0);
        return;

      case "setFlag":
        setFlag(event.flagId);
        return;

      case "giveQuest": {
        const questData = QUESTS[event.questId];

        if (!questData) {
          console.warn("Quest não encontrada:", event.questId);
          return;
        }

        addQuest(questData);
        return;
      }

      case "addItem": {
        const itemData = ITEMS[event.itemId];

        if (!itemData) {
          console.warn("Item não encontrado:", event.itemId);
          return;
        }

        addItem(itemData);
        return;
      }

      case "removeItem":
        removeItem(event.itemId);
        return;

      case "progressQuest":
        updateProgress(event.id, event.value);
        return;

      case "conditional":
        if (checkCondition(event.condition)) {
          event.then.forEach(runEvent);
        } else {
          event.else?.forEach(runEvent);
        }
        return;
    }
  };

  return {
    checkCondition,
    runEvent,
  };
}