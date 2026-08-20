import { useCallback, type RefObject } from "react";
import { getSelected } from "@/gameRules/menu/selection";
import { DIALOGUE_SPEED_LIST, type DialogueSpeed } from "@/utils/settings";
import type { ConfigTab } from "@/data/config/tabs";
import { DIFFICULTY } from "./configConstants";

interface UseConfigActionsParams {
  showQuestIndicator: boolean;
  sharedXp: boolean;
  showComboAction: boolean;
  showHighlight: boolean;

  screenRef: RefObject<"menu" | "tutorial">;
  isOnTabRef: RefObject<boolean>;
  activeTabRef: RefObject<ConfigTab>;
  selectedColumnRef: RefObject<number>;
  selectedIndexRef: RefObject<number>;
  modeRef: RefObject<string>;
  playSelectRef: RefObject<() => void>;
  playCloseRef: RefObject<() => void>;
  setDifficultyRef: RefObject<(d: NpcDifficulty) => void>;
  setDialogueSpeedRef: RefObject<(s: DialogueSpeed) => void>;
  setShowQuestIndicatorRef: RefObject<(v: boolean) => void>;
  setSharedXpRef: RefObject<(v: boolean) => void>;
  checkForUpdateRef: RefObject<() => void>;
  isInstalledRef: RefObject<boolean>;
  methodRef: RefObject<string>;
  installRef: RefObject<() => Promise<boolean>>;
  setShowInstalledMessageRef: RefObject<(v: boolean) => void>;
  setShowInstructionsRef: RefObject<(v: boolean) => void>;
  setShowComboActionRef: RefObject<(v: boolean) => void>;
  setShowHighlightRef: RefObject<(v: boolean) => void>;
  navigateRef: RefObject<(path: string) => void>;
  onConfirmRef: RefObject<(() => void) | undefined>;
  setScreen: (s: "menu" | "tutorial") => void;
}

export function useConfigActions({
  showQuestIndicator,
  sharedXp,
  showComboAction,
  showHighlight,
  screenRef,
  isOnTabRef,
  activeTabRef,
  selectedColumnRef,
  selectedIndexRef,
  modeRef,
  playSelectRef,
  playCloseRef,
  setDifficultyRef,
  setDialogueSpeedRef,
  setShowQuestIndicatorRef,
  setSharedXpRef,
  checkForUpdateRef,
  isInstalledRef,
  methodRef,
  installRef,
  setShowInstalledMessageRef,
  setShowInstructionsRef,
  setShowComboActionRef,
  setShowHighlightRef,
  navigateRef,
  onConfirmRef,
  setScreen,
}: UseConfigActionsParams) {
  const handleConfirm = useCallback((): boolean => {
    if (screenRef.current !== "menu") return true;
    if (isOnTabRef.current) return true;

    playSelectRef.current();

    const col = selectedColumnRef.current;
    const idx = selectedIndexRef.current;

    if (activeTabRef.current === "geral") {
      if (col === 0) {
        const selected = getSelected(DIFFICULTY, idx);
        setDifficultyRef.current(selected);
      }

      if (col === 1) {
        const selected = getSelected(DIALOGUE_SPEED_LIST, idx);
        setDialogueSpeedRef.current(selected);
      }

      if (col === 2) {
        if (idx === 0) {
          setShowQuestIndicatorRef.current(!showQuestIndicator);
        }

        if (idx === 1) {
          setSharedXpRef.current(!sharedXp);
        }

        if (idx === 2) {
          setScreen("tutorial");
        }

        if (idx === 3) {
          checkForUpdateRef.current();
        }

        if (idx === 4) {
          if (isInstalledRef.current) {
            setShowInstalledMessageRef.current(true);
          } else if (methodRef.current === "native") {
            void installRef.current();
          } else {
            setShowInstructionsRef.current(true);
          }
        }
      }
    }

    if (activeTabRef.current === "batalha") {
      if (idx === 0) {
        setShowComboActionRef.current(!showComboAction);
      }

      if (idx === 1) {
        setShowHighlightRef.current(!showHighlight);
      }

      if (idx === 2) {
        navigateRef.current("/training");
      }
    }

    onConfirmRef.current?.();

    return true;
  }, [
    showQuestIndicator,
    sharedXp,
    showComboAction,
    showHighlight,
    screenRef,
    isOnTabRef,
    activeTabRef,
    selectedColumnRef,
    selectedIndexRef,
    playSelectRef,
    setDifficultyRef,
    setDialogueSpeedRef,
    setShowQuestIndicatorRef,
    setSharedXpRef,
    setScreen,
    checkForUpdateRef,
    isInstalledRef,
    methodRef,
    installRef,
    setShowInstalledMessageRef,
    setShowInstructionsRef,
    setShowComboActionRef,
    setShowHighlightRef,
    navigateRef,
    onConfirmRef,
  ]);

  const handleCancel = useCallback((): boolean => {
    if (modeRef.current === "battle") return true;
    playCloseRef.current();
    if (screenRef.current === "tutorial") {
      setScreen("menu");
      return true;
    }

    return false;
  }, [modeRef, playCloseRef, screenRef, setScreen]);

  return { handleConfirm, handleCancel };
}
