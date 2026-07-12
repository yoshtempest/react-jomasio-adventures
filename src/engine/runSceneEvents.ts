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

export function runSceneEvents(
  events: SceneEvent[] | undefined,
  ctx: EventContext,
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
          lastPage,
          notLastPage,
        } = event.condition;

        const lastPageValue = ctx.location.state?.from;

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

        if (lastPage) {
          conditionMet &&= lastPageValue === lastPage;
        }

        if (notLastPage) {
          conditionMet &&= lastPageValue !== notLastPage;
        }

        runSceneEvents(conditionMet ? event.then : event.else, ctx);
        break;
      }

      case "openModal":
        if (event.modal === "class") {
          ctx.setShowClassModal?.(true);
        }
        break;

      case "playSound": {
        let audio = sfxPool.get(event.src);
        if (!audio) {
          audio = new Audio(event.src);
          sfxPool.set(event.src, audio);
        }
        audio.pause();
        audio.currentTime = 0;

        const raw = localStorage.getItem(SFX_KEY);
        const sfxVol = raw !== null ? Number(raw) : 50;
        audio.volume = (sfxVol / 100) * (event.volume ?? 1);
        audio.play().catch(() => {});
        break;
      }

      case "navigate": {
        const doNav = () =>
          ctx.navigate(event.to, {
            state: { from: ctx.location.pathname },
          });

        if (event.delay) {
          setTimeout(doNav, event.delay);
        } else {
          doNav();
        }
        return;
      }

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
