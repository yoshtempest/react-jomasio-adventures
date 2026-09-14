import { useLatestRef } from "@/hooks/useLatestRef";
import { incrementBlockCount } from "@/utils/rewards/blockCounter";
import {
  incrementAttacksUsedStats,
  incrementDamageDealtStats,
  incrementDamageTakenStats,
  incrementHitsUsedStats,
  incrementMissesStats,
  incrementSpecialsUsedStats,
} from "@/utils/rewards/battleStats";

type Props = {
  playerCharacter: CharacterId;
  incrementBlockCounter: () => void;
  incrementDamageTaken: (amount: number) => void;
  incrementDodgeCounter: () => void;
  incrementDamageDealt: (amount: number) => void;
};

export function useStatCallbacks({
  playerCharacter,
  incrementBlockCounter,
  incrementDamageTaken,
  incrementDodgeCounter,
  incrementDamageDealt,
}: Props) {
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