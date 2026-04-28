import { type SceneEvent } from "@/utils/types/maps/sceneEvents";

type EventContext = {
  navigate: (to: string) => void;
  setFlags?: (key: string, value: boolean) => void;
  progressQuest?: (id: string, value: number) => void;
  giveQuest?: (quest: any) => void;
};

export function runSceneEvents(
  events: SceneEvent[] | undefined,
  ctx: EventContext
) {
  if (!events) return;

  for (const event of events) {
    switch (event.type) {
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
        ctx.giveQuest?.(event.quest);
        break;

      case "log":
        break;
    }
  }
}