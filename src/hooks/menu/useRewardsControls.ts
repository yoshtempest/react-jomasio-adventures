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
  const { pushControls, popControls } = useGameControls();
  const rewardOptionIndexRef = useRef(0);
  const openNextChestRef = useRef(openNextChest);
  openNextChestRef.current = openNextChest;

  useEffect(() => {
    if (!chestRewardsVisible) return;

    onRewardOptionChange(0);
    rewardOptionIndexRef.current = 0;

    const controls = {
      onLeft: () => {
        if (rewardOptionCount <= 1) return true;
        playMove();
        onRewardOptionChange((prev) => {
          const next = circularPrev(prev, rewardOptionCount);
          rewardOptionIndexRef.current = next;
          return next;
        });
        return true;
      },
      onRight: () => {
        if (rewardOptionCount <= 1) return true;
        playMove();
        onRewardOptionChange((prev) => {
          const next = circularNext(prev, rewardOptionCount);
          rewardOptionIndexRef.current = next;
          return next;
        });
        return true;
      },
      onConfirm: () => {
        playSelect();
        if (rewardOptionCount > 1 && rewardOptionIndexRef.current === 0) {
          openNextChestRef.current(
            (lastOpened?.chestId ?? chestLastResult?.tier) as ItemId,
          );
        } else {
          closeRewards();
        }
        return true;
      },
      onCancel: () => {
        playSelect();
        closeRewards();
        return true;
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [
    chestRewardsVisible,
    rewardOptionCount,
    lastOpened,
    chestLastResult,
    playMove,
    playSelect,
    closeRewards,
    pushControls,
    popControls,
    onRewardOptionChange,
  ]);
}
