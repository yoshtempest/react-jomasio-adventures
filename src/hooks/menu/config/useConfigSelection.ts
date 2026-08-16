import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { getSelected } from "@/gameRules/menu/selection";
import { useAudio } from "@/contexts/AudioContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useSettings } from "@/contexts/SettingsContext";
import { useUpdate } from "@/contexts/UpdateContext";
import { usePWA } from "@/contexts/PWAContext";
import { DIALOGUE_SPEED_LIST } from "@/utils/settings";
import type { ConfigTab } from "@/data/config/tabs";
import { CONFIG_TABS, CONFIG_TAB_COUNT } from "@/data/config/tabs";

const DIFFICULTY: NpcDifficulty[] = ["easy", "medium", "hard"];
const COLUMN_COUNT = 5;
const BOTTOM_COUNT = 5;
const BATTLE_COUNT = 4;

function getColumnMaxIndex(column: number): number {
  if (column === 0) return DIFFICULTY.length;
  if (column === 1) return DIALOGUE_SPEED_LIST.length;
  if (column === 2) return BOTTOM_COUNT;
  return 1;
}

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
    canInstall,
    setShowInstalledMessage,
    setShowNotAvailableMessage,
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
  const canInstallRef = useLatestRef(canInstall);
  const setShowInstalledMessageRef = useLatestRef(setShowInstalledMessage);
  const setShowNotAvailableMessageRef = useLatestRef(setShowNotAvailableMessage);
  const onConfirmRef = useLatestRef(onConfirm);

  const navigateRef = useLatestRef(navigate);

  const modeRef = useLatestRef(player.mode);

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

      onConfirm: () => {
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
              } else if (canInstallRef.current) {
                installRef.current();
              } else {
                setShowNotAvailableMessageRef.current(true);
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
      },

      onCancel: () => {
        if (modeRef.current === "battle") return true;
        playCloseRef.current();
        if (screenRef.current === "tutorial") {
          setScreen("menu");
          return true;
        }

        return false;
      },

      blockGlobalOpen: true,
    };

    const remove = pushControlsRef.current(controls);

    return () => remove();
  }, [
    isActive,
    sfxVolume,
    bgmVolume,
    showQuestIndicator,
    setShowQuestIndicator,
    showComboAction,
    setShowComboAction,
    showHighlight,
    setShowHighlight,
    sharedXp,
    setSharedXp,
    canInstallRef,
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
    setShowNotAvailableMessageRef,
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
