import { useRef } from "react";
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
  const onBlockRef = useRef(() => {});
  onBlockRef.current = () => {
    incrementBlockCount(playerCharacter);
    incrementBlockCounter();
  };

  const onDamageTakenRef = useRef<(amount: number) => void>(() => {});
  onDamageTakenRef.current = (amount: number) => {
    incrementDamageTaken(amount);
    incrementDamageTakenStats(playerCharacter, amount);
  };

  const onDodgeRef = useRef(() => {});
  onDodgeRef.current = () => {
    incrementDodgeCounter();
    incrementMissesStats(playerCharacter);
  };

  const onDamageDealtRef = useRef<(amount: number) => void>(() => {});
  onDamageDealtRef.current = (amount: number) => {
    incrementDamageDealt(amount);
    incrementDamageDealtStats(playerCharacter, amount);
  };

  const onAttackRef = useRef(() => {});
  onAttackRef.current = () => {
    incrementAttacksUsedStats(playerCharacter);
    incrementHitsUsedStats(playerCharacter);
  };

  const onSpecialRef = useRef(() => {});
  onSpecialRef.current = () => {
    incrementSpecialsUsedStats(playerCharacter);
    incrementHitsUsedStats(playerCharacter);
  };

  return {
    onBlockRef,
    onDamageTakenRef,
    onDodgeRef,
    onDamageDealtRef,
    onAttackRef,
    onSpecialRef,
  };
}
