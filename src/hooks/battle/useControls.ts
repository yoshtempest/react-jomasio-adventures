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
  skipSpecialHitOnPress?: boolean;
  /** Substitui o fluxo do special no onOpen (ex.: animação de abertura do special). */
  openSpecial?: () => void;
  onChargePress?: () => void;
  onChargeRelease?: () => void;
  onChargeCancel?: () => void;
  /** Chamado no onConfirmRelease quando não há charge (ex.: hold do artur). */
  onComboRelease?: () => void;
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
  skipSpecialHitOnPress = false,
  openSpecial,
  onChargePress,
  onChargeRelease,
  onChargeCancel,
  onComboRelease,
}: Props) {
  const { pushControls } = useGameControls();

  const attackRef = useLatestRef(attack);
  const specialRef = useLatestRef(special);
  const blockStartRef = useLatestRef(blockStart);
  const blockEndRef = useLatestRef(blockEnd);
  const playerHitRef = useLatestRef(handlePlayerHit);
  const specialHitRef = useLatestRef(handleSpecialHit);
  const openSpecialRef = useLatestRef(openSpecial);
  const chargePressRef = useLatestRef(onChargePress ?? (() => {}));
  const chargeReleaseRef = useLatestRef(onChargeRelease ?? (() => {}));
  const chargeCancelRef = useLatestRef(onChargeCancel ?? (() => {}));
  const comboReleaseRef = useLatestRef(onComboRelease ?? (() => {}));

  const hasChargeRef = useLatestRef(!!onChargePress);
  const skipSpecialHitRef = useLatestRef(skipSpecialHitOnPress);

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
        : () => {
            comboReleaseRef.current();
          },

      onCancel: () => {
        blockStartRef.current();
      },

      onCancelRelease: () => {
        blockEndRef.current();
      },

      onOpen: () => {
        if (openSpecialRef.current) {
          openSpecialRef.current();
          return;
        }
        specialRef.current();
        if (!skipSpecialHitRef.current) {
          specialHitRef.current();
        }
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
    skipSpecialHitRef,
    playerStateRef,
    pushControlsRef,
    attackRef,
    blockEndRef,
    blockStartRef,
    chargeCancelRef,
    chargePressRef,
    chargeReleaseRef,
    comboReleaseRef,
    playerHitRef,
    specialHitRef,
    specialRef,
    openSpecialRef,
  ]);
}
