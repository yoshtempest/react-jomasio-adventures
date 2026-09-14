import { useLatestRef } from "@/hooks/useLatestRef";
import { incrementBlockCount } from "@/utils/rewards/blockCounter";
import {
  incrementDamageDealtStats,
  incrementDamageTakenStats,
  incrementMissesStats,
  incrementHitsUsedStats,
  incrementSpecialsUsedStats,
  incrementAttacksUsedStats,
} from "@/utils/rewards/battleStats";

type Params = {
  playerCharacter: CharacterId;
  incrementBlockCounter: () => void;
  incrementDamageTaken: (amount: number) => void;
  incrementDamageDealt: (amount: number) => void;
  incrementDodgeCounter: () => void;
};

export function useBattleStatRefs({
  playerCharacter,
  incrementBlockCounter,
  incrementDamageTaken,
  incrementDamageDealt,
  incrementDodgeCounter,
}: Params) {
  const onBlockRef = useLatestRef(() => {
    incrementBlockCount(playerCharacter);
    incrementBlockCounter();
  });

  const onDamageTakenRef = useLatestRef((amount: number) => {
    incrementDamageTaken(amount);
    incrementDamageTakenStats(playerCharacter, amount);
  });

  const onDodgeRef = useLatestRef(() => {
    incrementDodgeCounter();
    incrementMissesStats(playerCharacter);
  });

  const onDamageDealtRef = useLatestRef((amount: number) => {
    incrementDamageDealt(amount);
    incrementDamageDealtStats(playerCharacter, amount);
  });

  const onAttackRef = useLatestRef(() => {
    incrementAttacksUsedStats(playerCharacter);
    incrementHitsUsedStats(playerCharacter);
  });

  const onSpecialRef = useLatestRef(() => {
    incrementSpecialsUsedStats(playerCharacter);
    incrementHitsUsedStats(playerCharacter);
  });

  return {
    onBlockRef,
    onDamageTakenRef,
    onDodgeRef,
    onDamageDealtRef,
    onAttackRef,
    onSpecialRef,
  };
}
