import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

type Props = {
  attack: () => void;
  special: () => void;
  handlePlayerHit: () => void;
  handleSpecialHit: () => void;
  disabled: boolean;
};

export function useBattleControls({
  attack,
  special,
  handlePlayerHit,
  handleSpecialHit,
  disabled,
}: Props) {
  const { pushControls, popControls } =
    useGameControls();

  const attackRef = useRef(attack);
  const specialRef = useRef(special);
  const playerHitRef = useRef(handlePlayerHit);
  const specialHitRef = useRef(handleSpecialHit);

  attackRef.current = attack;
  specialRef.current = special;
  playerHitRef.current = handlePlayerHit;
  specialHitRef.current = handleSpecialHit;

  useEffect(() => {
    if (disabled) return;

    const controls = {
      onConfirm: () => {
        attackRef.current();
        playerHitRef.current();
      },

      onCancel: () => {
        specialRef.current();
        specialHitRef.current();
      },
    };

    pushControls(controls);

    return () => popControls();
  }, [disabled]);
}