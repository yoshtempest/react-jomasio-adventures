import { useEffect } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";

type Props = {
  attack: () => void;
  special: () => void;
  blockStart: () => void;
  blockEnd: () => void;
  handlePlayerHit: () => void;
  handleSpecialHit: () => void;
  disabled: boolean;
  playerState: PlayerState;
  onChargePress?: () => void;
  onChargeRelease?: () => void;
  onChargeCancel?: () => void;
};

const HOLD_DISCRIMINATOR = 150;

export function useBattleControls({
  attack,
  special,
  blockStart,
  blockEnd,
  handlePlayerHit,
  handleSpecialHit,
  disabled,
  playerState,
  onChargePress,
  onChargeRelease,
  onChargeCancel,
}: Props) {
  const { pushControls } = useGameControls();

  const attackRef = useLatestRef(attack);
  const specialRef = useLatestRef(special);
  const blockStartRef = useLatestRef(blockStart);
  const blockEndRef = useLatestRef(blockEnd);
  const playerHitRef = useLatestRef(handlePlayerHit);
  const specialHitRef = useLatestRef(handleSpecialHit);
  const chargePressRef = useLatestRef(onChargePress ?? (() => {}));
  const chargeReleaseRef = useLatestRef(onChargeRelease ?? (() => {}));
  const chargeCancelRef = useLatestRef(onChargeCancel ?? (() => {}));

  const hasChargeRef = useLatestRef(!!onChargePress);

  const playerStateRef = useLatestRef(playerState);

  const pushControlsRef = useLatestRef(pushControls);

  useEffect(() => {
    if (disabled) return;

    const hasCharge = hasChargeRef.current;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;
    let isHoldingCharge = false;

    const controls = {
      onConfirm: () => {
        const comboState =
          playerStateRef.current === "blocked" ||
          playerStateRef.current === "falling";
        if (hasCharge && !comboState) {
          if (holdTimer || isHoldingCharge) return;
          holdTimer = setTimeout(() => {
            chargePressRef.current();
            holdTimer = null;
            isHoldingCharge = true;
          }, HOLD_DISCRIMINATOR);
        } else {
          attackRef.current();
          playerHitRef.current();
        }
      },

      onConfirmRelease: hasCharge
        ? () => {
            if (holdTimer) {
              clearTimeout(holdTimer);
              holdTimer = null;
              attackRef.current();
              playerHitRef.current();
              return;
            }
            isHoldingCharge = false;
            chargeReleaseRef.current();
          }
        : undefined,

      onCancel: () => {
        blockStartRef.current();
      },

      onCancelRelease: () => {
        blockEndRef.current();
      },

      onOpen: () => {
        specialRef.current();
        specialHitRef.current();
      },

      onUp: hasCharge
        ? () => {
            chargeCancelRef.current();
          }
        : undefined,

      onDown: hasCharge
        ? () => {
            chargeCancelRef.current();
          }
        : undefined,

      onLeft: hasCharge
        ? () => {
            chargeCancelRef.current();
          }
        : undefined,

      onRight: hasCharge
        ? () => {
            chargeCancelRef.current();
          }
        : undefined,
    };

    const remove = pushControlsRef.current(controls);

    return () => {
      if (holdTimer) clearTimeout(holdTimer);
      remove();
    };
  }, [
    disabled,
    hasChargeRef,
    playerStateRef,
    pushControlsRef,
    attackRef,
    blockEndRef,
    blockStartRef,
    chargeCancelRef,
    chargePressRef,
    chargeReleaseRef,
    playerHitRef,
    specialHitRef,
    specialRef,
  ]);
}
