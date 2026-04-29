import { type SceneEvent } from "@/utils/types/maps/sceneEvents";
import { QUESTS } from "@/data/quests";
import { ITEMS } from "@/data/items";

type EventContext = {
  navigate: (to: string) => void;
  setShowClassModal: (v: boolean) => void;
  setFlags?: (key: string, value: boolean) => void;
  progressQuest?: (id: string, value: number) => void;
  giveQuest?: (quest: any) => void;
  addItem?: (item: any) => void;
};

export function runSceneEvents(
  events: SceneEvent[] | undefined,
  ctx: EventContext
) {
  if (!events) return;

  for (const event of events) {
    switch (event.type) {
      case "openModal":
        if (event.modal === "class") {
          ctx.setShowClassModal(true);
        }
        break;

      case "navigate":
        ctx.navigate(event.to);
        break;

      case "setFlag":
        ctx.setFlags?.(event.key, event.value);
        break;

      case "progressQuest":
        ctx.progressQuest?.(event.id, event.value);
        break;

      case "giveQuest":
        const quest = QUESTS[event.questId];
        ctx.giveQuest?.(quest);
        break;

      case "addItem": {
        const item = ITEMS[event.itemId];

        ctx.addItem?.(item); // 👈 agora correto
        break;
      }

      case "log":
        break;
    }
  }
}