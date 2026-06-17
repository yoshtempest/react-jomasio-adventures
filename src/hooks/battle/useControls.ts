import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

type Props = {
  attack: () => void;
  special: () => void;
  handlePlayerHit: () => void;
  handleSpecialHit: () => void;
  disabled: boolean;
  onChargePress?: () => void;
  onChargeRelease?: () => void;
  onChargeCancel?: () => void;
};

const HOLD_DISCRIMINATOR = 150;

export function useBattleControls({
  attack,
  special,
  handlePlayerHit,
  handleSpecialHit,
  disabled,
  onChargePress,
  onChargeRelease,
  onChargeCancel,
}: Props) {
  const { pushControls, popControls } = useGameControls();

  const attackRef = useRef(attack);
  const specialRef = useRef(special);
  const playerHitRef = useRef(handlePlayerHit);
  const specialHitRef = useRef(handleSpecialHit);
  const chargePressRef = useRef(onChargePress ?? (() => {}));
  const chargeReleaseRef = useRef(onChargeRelease ?? (() => {}));
  const chargeCancelRef = useRef(onChargeCancel ?? (() => {}));

  attackRef.current = attack;
  specialRef.current = special;
  playerHitRef.current = handlePlayerHit;
  specialHitRef.current = handleSpecialHit;
  chargePressRef.current = onChargePress ?? (() => {});
  chargeReleaseRef.current = onChargeRelease ?? (() => {});
  chargeCancelRef.current = onChargeCancel ?? (() => {});

  const hasChargeRef = useRef(!!onChargePress);
  hasChargeRef.current = !!onChargePress;

  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;

  useEffect(() => {
    if (disabled) return;

    const hasCharge = hasChargeRef.current;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;
    let isHoldingCharge = false;

    const controls = {
      onConfirm: () => {
        if (hasCharge) {
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
              // tap < 150ms → normal attack
              attackRef.current();
              playerHitRef.current();
              return;
            }
            isHoldingCharge = false;
            chargeReleaseRef.current();
          }
        : undefined,

      onCancel: () => {
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

    pushControlsRef.current(controls);

    return () => {
      if (holdTimer) clearTimeout(holdTimer);
      popControlsRef.current();
    };
  }, [disabled]);
}
