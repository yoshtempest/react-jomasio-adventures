import { type SceneEvent } from "@/utils/types/maps/sceneEvents";

type EventContext = {
  navigate: (to: string) => void;
  setFlags?: (key: string, value: boolean) => void;
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

      case "log":
        console.log("[SceneEvent]", event.message);
        break;
    }
  }
}