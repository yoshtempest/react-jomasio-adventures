import type { ChestOpenResult } from "@/hooks/useChestOpening";
import type { DailyChestResult } from "@/hooks/useDailyChest";
import type { Dispatch, SetStateAction } from "react";
import { ChestRewards } from "../ChestRewards";

type Props = {
  dailyResult: DailyChestResult | null;
  chestResult: ChestOpenResult | null;
  hasOtherChest: boolean;
  rewardOptionIndex: number;
  rewardOptionCount: number;
  lastOpened: { chestId: ItemId; keyId: ItemId } | null;
  onSelect: Dispatch<SetStateAction<number>>;
  onCloseDaily: () => void;
  onCloseChest: () => void;
  onOpenNextChest: (excludeId: ItemId) => void;
};

export function RewardsView({
  dailyResult,
  chestResult,
  hasOtherChest,
  rewardOptionIndex,
  rewardOptionCount,
  lastOpened,
  onSelect,
  onCloseDaily,
  onCloseChest,
  onOpenNextChest,
}: Props) {
  if (dailyResult) {
    return (
      <ChestRewards
        result={dailyResult}
        isDaily
        otherChestAvailable={false}
        selectedIndex={rewardOptionIndex}
        onSelect={onSelect}
        onConfirm={onCloseDaily}
      />
    );
  }

  if (chestResult) {
    return (
      <ChestRewards
        result={chestResult}
        isDaily={false}
        otherChestAvailable={hasOtherChest}
        selectedIndex={rewardOptionIndex}
        onSelect={onSelect}
        onConfirm={() => {
          if (rewardOptionCount > 1 && rewardOptionIndex === 0) {
            onOpenNextChest(lastOpened?.chestId ?? (chestResult.tier as unknown as ItemId));
          } else {
            onCloseChest();
          }
        }}
      />
    );
  }

  return null;
}
