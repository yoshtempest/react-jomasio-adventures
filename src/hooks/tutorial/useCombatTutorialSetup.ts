import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";

interface CombatTutorialSetupLayout {
  TILE_SIZE: number;
  scaleX: number;
  scaleY: number;
}

export function useCombatTutorialSetup(layout: CombatTutorialSetupLayout) {
  const { setMode, setBattleCollision, attack } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const { TILE_SIZE, scaleX, scaleY } = layout;

  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;
  const setBattleCollisionRef = useRef(setBattleCollision);
  setBattleCollisionRef.current = setBattleCollision;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const attackRef = useRef(attack);
  attackRef.current = attack;

  useEffect(() => {
    setModeRef.current("battle");
  }, []);

  useEffect(() => {
    setBattleCollisionRef.current({ map: null, TILE_SIZE, scaleX, scaleY });
    return () =>
      setBattleCollisionRef.current({
        map: null,
        TILE_SIZE: 0,
        scaleX: 1,
        scaleY: 1,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    pushControlsRef.current({
      onConfirm: () => {
        attackRef.current();
      },
      blockGlobalOpen: true,
    });
    return () => popControlsRef.current();
  }, []);
}
