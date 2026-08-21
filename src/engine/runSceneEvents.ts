import type { NavigateFunction } from "react-router";
import { SFX_KEY } from "@/data/storageKeys";

const sfxPool = new Map<string, HTMLAudioElement>();

type EventContext = {
  navigate: NavigateFunction;
  location: { pathname: LastPage; state?: { from?: LastPage } };

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

type SceneCondition = Extract<SceneEvent, { type: "conditional" }>["condition"];

function evaluateCondition(
  ctx: EventContext,
  condition: SceneCondition,
): boolean {
  const {
    hasItem,
    notHasItem,
    hasQuest,
    notHasQuest,
    hasFlag,
    notHasFlag,
    lastPage,
    notLastPage,
  } = condition;

  const lastPageValue = ctx.location.state?.from;

  return (
    (!hasItem || !!ctx.hasItem?.(hasItem)) &&
    (!notHasItem || !ctx.hasItem?.(notHasItem)) &&
    (!hasQuest || !!ctx.hasQuest?.(hasQuest)) &&
    (!notHasQuest || !ctx.hasQuest?.(notHasQuest)) &&
    (!hasFlag || !!ctx.hasFlag?.(hasFlag)) &&
    (!notHasFlag || !ctx.hasFlag?.(notHasFlag)) &&
    (!lastPage || lastPageValue === lastPage) &&
    (!notLastPage || lastPageValue !== notLastPage)
  );
}

function playSfx(src: string, volume?: number): void {
  let audio = sfxPool.get(src);
  if (!audio) {
    audio = new Audio(src);
    sfxPool.set(src, audio);
  }
  audio.pause();
  audio.currentTime = 0;

  const raw = localStorage.getItem(SFX_KEY);
  const sfxVol = raw !== null ? Number(raw) : 50;
  audio.volume = (sfxVol / 100) * (volume ?? 1);
  audio.play().catch(() => {});
}

function handleNavigate(
  ctx: EventContext,
  event: Extract<SceneEvent, { type: "navigate" }>,
): void {
  const doNav = () =>
    ctx.navigate(event.to, {
      state: { from: ctx.location.pathname },
    });

  if (event.delay) {
    setTimeout(() => void doNav(), event.delay);
  } else {
    void doNav();
  }
}

export function runSceneEvents(
  events: SceneEvent[] | undefined,
  ctx: EventContext,
) {
  if (!events) return;

  for (const event of events) {
    switch (event.type) {
      case "conditional":
        runSceneEvents(
          evaluateCondition(ctx, event.condition) ? event.then : event.else,
          ctx,
        );
        break;

      case "openModal":
        if (event.modal === "class") {
          ctx.setShowClassModal?.(true);
        }
        break;

      case "playSound":
        playSfx(event.src, event.volume);
        break;

      case "navigate":
        handleNavigate(ctx, event);
        return;

      case "setFlag":
        ctx.setFlag?.(event.flagId);
        break;

      case "progressQuest":
        ctx.progressQuest?.(event.id, event.value);
        break;

      case "giveQuest":
        ctx.giveQuest?.(event.questId);
        break;

      case "addItem":
        ctx.addItem?.(event.itemId);
        break;

      case "removeItem":
        ctx.removeItem?.(event.itemId);
        break;

      case "log":
        console.log(event.message);
        break;
    }
  }
}
