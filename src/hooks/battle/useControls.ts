import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

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

  const attackRef = useRef(attack);
  const specialRef = useRef(special);
  const blockStartRef = useRef(blockStart);
  const blockEndRef = useRef(blockEnd);
  const playerHitRef = useRef(handlePlayerHit);
  const specialHitRef = useRef(handleSpecialHit);
  const chargePressRef = useRef(onChargePress ?? (() => {}));
  const chargeReleaseRef = useRef(onChargeRelease ?? (() => {}));
  const chargeCancelRef = useRef(onChargeCancel ?? (() => {}));

  attackRef.current = attack;
  specialRef.current = special;
  blockStartRef.current = blockStart;
  blockEndRef.current = blockEnd;
  playerHitRef.current = handlePlayerHit;
  specialHitRef.current = handleSpecialHit;
  chargePressRef.current = onChargePress ?? (() => {});
  chargeReleaseRef.current = onChargeRelease ?? (() => {});
  chargeCancelRef.current = onChargeCancel ?? (() => {});

  const hasChargeRef = useRef(!!onChargePress);
  hasChargeRef.current = !!onChargePress;

  const playerStateRef = useRef(playerState);
  playerStateRef.current = playerState;

  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;

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
  }, [disabled]);
}
