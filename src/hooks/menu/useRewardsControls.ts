import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";

type Params = {
  chestRewardsVisible: boolean;
  rewardOptionCount: number;
  lastOpened: { chestId: string } | null | undefined;
  chestLastResult: { tier: string } | null;
  playMove: () => void;
  playSelect: () => void;
  closeRewards: () => void;
  openNextChest: (id: ItemId) => unknown;
  onRewardOptionChange: (
    indexOrUpdater: number | ((prev: number) => number),
  ) => void;
};

export function useRewardsControls({
  chestRewardsVisible,
  rewardOptionCount,
  lastOpened,
  chestLastResult,
  playMove,
  playSelect,
  closeRewards,
  openNextChest,
  onRewardOptionChange,
}: Params) {
  const { pushControls } = useGameControls();
  const rewardOptionIndexRef = useRef(0);
  const rewardOptionCountRef = useRef(rewardOptionCount);
  rewardOptionCountRef.current = rewardOptionCount;
  const lastOpenedRef = useRef(lastOpened);
  lastOpenedRef.current = lastOpened;
  const chestLastResultRef = useRef(chestLastResult);
  chestLastResultRef.current = chestLastResult;
  const openNextChestRef = useRef(openNextChest);
  openNextChestRef.current = openNextChest;
  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const closeRewardsRef = useRef(closeRewards);
  closeRewardsRef.current = closeRewards;

  useEffect(() => {
    if (!chestRewardsVisible) return;

    onRewardOptionChange(0);
    rewardOptionIndexRef.current = 0;

    const controls = {
      onLeft: () => {
        if (rewardOptionCountRef.current <= 1) return true;
        playMoveRef.current();
        onRewardOptionChange((prev) => {
          const next = circularPrev(prev, rewardOptionCountRef.current);
          rewardOptionIndexRef.current = next;
          return next;
        });
        return true;
      },
      onRight: () => {
        if (rewardOptionCountRef.current <= 1) return true;
        playMoveRef.current();
        onRewardOptionChange((prev) => {
          const next = circularNext(prev, rewardOptionCountRef.current);
          rewardOptionIndexRef.current = next;
          return next;
        });
        return true;
      },
      onConfirm: () => {
        playSelectRef.current();
        if (
          rewardOptionCountRef.current > 1 &&
          rewardOptionIndexRef.current === 0
        ) {
          openNextChestRef.current(
            (lastOpenedRef.current?.chestId ??
              chestLastResultRef.current?.tier) as ItemId,
          );
        } else {
          closeRewardsRef.current();
        }
        return true;
      },
      onCancel: () => {
        playSelectRef.current();
        closeRewardsRef.current();
        return true;
      },
    };

    const remove = pushControls(controls);
    return remove;
  }, [
    chestRewardsVisible,
    pushControls,
    onRewardOptionChange,
  ]);
}
