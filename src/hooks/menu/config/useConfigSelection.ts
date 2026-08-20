import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useAudio } from "@/contexts/AudioContext";

import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useSettings } from "@/contexts/SettingsContext";
import { useUpdate } from "@/contexts/UpdateContext";
import { usePWA } from "@/contexts/PWAContext";
import type { ConfigTab } from "@/data/config/tabs";
import { CONFIG_TABS, CONFIG_TAB_COUNT } from "@/data/config/tabs";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  DIFFICULTY,
  COLUMN_COUNT,
  BATTLE_COUNT,
  getColumnMaxIndex,
} from "./configConstants";
import { useConfigActions } from "./useConfigActions";

export function useConfigSelection(isActive: boolean, onConfirm?: () => void) {
  const navigate = useNavigate();
  const { pushControls } = useGameControls();

  const { setDifficulty, player } = usePlayer();
  const { sfxVolume, setSfxVolume, bgmVolume, setBgmVolume } = useAudio();
  const {
    setDialogueSpeed,
    showQuestIndicator,
    setShowQuestIndicator,
    showComboAction,
    setShowComboAction,
    showHighlight,
    setShowHighlight,
    sharedXp,
    setSharedXp,
  } = useSettings();
  const { checkForUpdate } = useUpdate();
  const {
    install,
    isInstalled,
    method,
    setShowInstalledMessage,
    setShowInstructions,
  } = usePWA();
  const { playMove, playSelect, playClose } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColumn, setSelectedColumn] = useState(0);

  const [activeTab, setActiveTab] = useState<ConfigTab>("geral");
  const [isOnTab, setIsOnTab] = useState(true);

  // menu | tutorial
  const [screen, setScreen] = useState<"menu" | "tutorial">("menu");

  const selectedIndexRef = useLatestRef(selectedIndex);
  const selectedColumnRef = useLatestRef(selectedColumn);
  const screenRef = useLatestRef(screen);
  const isOnTabRef = useLatestRef(isOnTab);
  const activeTabRef = useLatestRef(activeTab);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    selectedColumnRef.current = selectedColumn;
    screenRef.current = screen;
    isOnTabRef.current = isOnTab;
    activeTabRef.current = activeTab;
  }, [
    selectedIndex,
    selectedColumn,
    screen,
    isOnTab,
    activeTab,
    selectedIndexRef,
    selectedColumnRef,
    screenRef,
    isOnTabRef,
    activeTabRef,
  ]);

  const playMoveRef = useLatestRef(playMove);
  const playSelectRef = useLatestRef(playSelect);
  const playCloseRef = useLatestRef(playClose);
  const pushControlsRef = useLatestRef(pushControls);
  const setDifficultyRef = useLatestRef(setDifficulty);
  const setSfxVolumeRef = useLatestRef(setSfxVolume);
  const setBgmVolumeRef = useLatestRef(setBgmVolume);
  const setDialogueSpeedRef = useLatestRef(setDialogueSpeed);
  const setShowQuestIndicatorRef = useLatestRef(setShowQuestIndicator);
  const setShowComboActionRef = useLatestRef(setShowComboAction);
  const setShowHighlightRef = useLatestRef(setShowHighlight);
  const setSharedXpRef = useLatestRef(setSharedXp);
  const checkForUpdateRef = useLatestRef(checkForUpdate);
  const installRef = useLatestRef(install);
  const isInstalledRef = useLatestRef(isInstalled);
  const methodRef = useLatestRef(method);
  const setShowInstalledMessageRef = useLatestRef(setShowInstalledMessage);
  const setShowInstructionsRef = useLatestRef(setShowInstructions);
  const onConfirmRef = useLatestRef(onConfirm);
  const navigateRef = useLatestRef(navigate);

  const modeRef = useLatestRef(player.mode);

  const { handleConfirm, handleCancel } = useConfigActions({
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
  });

  useEffect(() => {
    if (!isActive) return;

    const controls = {
      onRight: () => {
        if (screenRef.current !== "menu") return;
        playMoveRef.current();

        if (isOnTabRef.current) {
          setActiveTab((prev) => {
            const currentIdx = CONFIG_TABS.indexOf(prev);
            return CONFIG_TABS[(currentIdx + 1) % CONFIG_TAB_COUNT];
          });
          return;
        }

        if (activeTabRef.current === "batalha") return;

        setSelectedColumn((prev) => (prev + 1) % COLUMN_COUNT);
        setSelectedIndex(0);
      },

      onLeft: () => {
        if (screenRef.current !== "menu") return;
        playMoveRef.current();

        if (isOnTabRef.current) {
          setActiveTab((prev) => {
            const currentIdx = CONFIG_TABS.indexOf(prev);
            return CONFIG_TABS[
              (currentIdx - 1 + CONFIG_TAB_COUNT) % CONFIG_TAB_COUNT
            ];
          });
          return;
        }

        if (activeTabRef.current === "batalha") {
          setIsOnTab(true);
          return;
        }

        if (selectedColumnRef.current === 0) {
          setIsOnTab(true);
          return;
        }

        setSelectedColumn((prev) => prev - 1);
        setSelectedIndex(0);
      },

      onDown: () => {
        if (screenRef.current !== "menu") return;
        playMoveRef.current();

        if (isOnTabRef.current) {
          setIsOnTab(false);
          setSelectedColumn(0);
          setSelectedIndex(0);
          return;
        }

        const col = selectedColumnRef.current;

        if (activeTabRef.current === "batalha") {
          const maxIndex = BATTLE_COUNT;
          setSelectedIndex((prev) => (prev + 1) % maxIndex);
          return;
        }

        if (col === 3) {
          setSfxVolumeRef.current(Math.min(sfxVolume + 10, 100));
          return;
        }

        if (col === 4) {
          setBgmVolumeRef.current(Math.min(bgmVolume + 10, 100));
          return;
        }

        const maxIndex = getColumnMaxIndex(col);
        setSelectedIndex((prev) => (prev + 1) % maxIndex);
      },

      onUp: () => {
        if (screenRef.current !== "menu") return;
        playMoveRef.current();

        if (isOnTabRef.current) return;

        if (activeTabRef.current === "batalha") {
          if (selectedIndexRef.current === 0) {
            setIsOnTab(true);
            return;
          }
          setSelectedIndex((prev) => prev - 1);
          return;
        }

        const col = selectedColumnRef.current;

        if (col === 3) {
          setSfxVolumeRef.current(Math.max(sfxVolume - 10, 0));
          return;
        }

        if (col === 4) {
          setBgmVolumeRef.current(Math.max(bgmVolume - 10, 0));
          return;
        }

        if (selectedIndexRef.current === 0) {
          setIsOnTab(true);
          return;
        }

        setSelectedIndex((prev) => prev - 1);
      },

      onConfirm: handleConfirm,

      onCancel: handleCancel,

      blockGlobalOpen: true,
    };

    const remove = pushControlsRef.current(controls);

    return () => remove();
  }, [
    isActive,
    sfxVolume,
    bgmVolume,
    handleConfirm,
    handleCancel,
    setShowQuestIndicator,
    setShowComboAction,
    setShowHighlight,
    setSharedXp,
    checkForUpdateRef,
    installRef,
    isInstalledRef,
    modeRef,
    navigateRef,
    onConfirmRef,
    playCloseRef,
    playMoveRef,
    playSelectRef,
    pushControlsRef,
    setBgmVolumeRef,
    setDialogueSpeedRef,
    setDifficultyRef,
    setSfxVolumeRef,
    setSharedXpRef,
    setShowComboActionRef,
    setShowHighlightRef,
    setShowInstalledMessageRef,
    setShowQuestIndicatorRef,
    activeTabRef,
    isOnTabRef,
    screenRef,
    selectedColumnRef,
    selectedIndexRef,
  ]);

  return {
    difficulty: DIFFICULTY,
    selectedIndex,
    selectedColumn,
    screen,
    showQuestIndicator,
    showComboAction,
    showHighlight,
    sharedXp,
    activeTab,
    isOnTab,
  };
}
