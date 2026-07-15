import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { useAudio } from "@/contexts/AudioContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useSettings } from "@/contexts/SettingsContext";
import { useUpdate } from "@/contexts/UpdateContext";
import { usePWA } from "@/contexts/PWAContext";
import { DIALOGUE_SPEED_LIST } from "@/utils/settings";
import type { ConfigTab } from "@/data/config/tabs";
import { CONFIG_TABS, CONFIG_TAB_COUNT } from "@/data/config/tabs";

const DIFFICULTY: NpcDifficulty[] = ["easy", "medium", "hard"];
const MAX_ROW = 4;
const BOTTOM_COUNT = 4;

export function useConfigSelection(isActive: boolean, onConfirm?: () => void) {
  const { pushControls, popControls } = useGameControls();

  const { setDifficulty } = usePlayer();
  const { sfxVolume, setSfxVolume, bgmVolume, setBgmVolume } = useAudio();
  const { setDialogueSpeed, showQuestIndicator, setShowQuestIndicator } = useSettings();
  const { checkForUpdate } = useUpdate();
  const { install, isInstalled, canInstall, setShowInstalledMessage, setShowNotAvailableMessage } = usePWA();
  const { playMove, playSelect, playClose } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [selectedRow, setSelectedRow] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const [activeTab, setActiveTab] = useState<ConfigTab>("geral");
  const [isOnTab, setIsOnTab] = useState(true);

  // menu | tutorial
  const [screen, setScreen] = useState<"menu" | "tutorial">("menu");

  const selectedIndexRef = useRef(selectedIndex);
  const selectedRowRef = useRef(selectedRow);
  const bottomIndexRef = useRef(bottomIndex);
  const screenRef = useRef(screen);
  const isOnTabRef = useRef(isOnTab);
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    selectedRowRef.current = selectedRow;
    bottomIndexRef.current = bottomIndex;
    screenRef.current = screen;
    isOnTabRef.current = isOnTab;
    activeTabRef.current = activeTab;
  }, [selectedIndex, selectedRow, bottomIndex, screen, isOnTab, activeTab]);

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const playCloseRef = useRef(playClose);
  playCloseRef.current = playClose;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const setDifficultyRef = useRef(setDifficulty);
  setDifficultyRef.current = setDifficulty;
  const setSfxVolumeRef = useRef(setSfxVolume);
  setSfxVolumeRef.current = setSfxVolume;
  const setBgmVolumeRef = useRef(setBgmVolume);
  setBgmVolumeRef.current = setBgmVolume;
  const setDialogueSpeedRef = useRef(setDialogueSpeed);
  setDialogueSpeedRef.current = setDialogueSpeed;
  const setShowQuestIndicatorRef = useRef(setShowQuestIndicator);
  setShowQuestIndicatorRef.current = setShowQuestIndicator;
  const checkForUpdateRef = useRef(checkForUpdate);
  checkForUpdateRef.current = checkForUpdate;
  const installRef = useRef(install);
  installRef.current = install;
  const isInstalledRef = useRef(isInstalled);
  isInstalledRef.current = isInstalled;
  const canInstallRef = useRef(canInstall);
  canInstallRef.current = canInstall;
  const setShowInstalledMessageRef = useRef(setShowInstalledMessage);
  setShowInstalledMessageRef.current = setShowInstalledMessage;
  const setShowNotAvailableMessageRef = useRef(setShowNotAvailableMessage);
  setShowNotAvailableMessageRef.current = setShowNotAvailableMessage;
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

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

        if (selectedRowRef.current === 0) {
          setSelectedIndex((prev) => circularNext(prev, DIFFICULTY.length));
        }

        if (selectedRowRef.current === 1) {
          setSelectedIndex((prev) =>
            circularNext(prev, DIALOGUE_SPEED_LIST.length),
          );
        }

        if (selectedRowRef.current === 2) {
          setSfxVolumeRef.current(Math.min(sfxVolume + 10, 100));
        }

        if (selectedRowRef.current === 3) {
          setBgmVolumeRef.current(Math.min(bgmVolume + 10, 100));
        }

        if (selectedRowRef.current === 4) {
          setBottomIndex((prev) => (prev + 1) % BOTTOM_COUNT);
        }
      },

      onLeft: () => {
        if (screenRef.current !== "menu") return;
        playMoveRef.current();

        if (isOnTabRef.current) {
          setActiveTab((prev) => {
            const currentIdx = CONFIG_TABS.indexOf(prev);
            return CONFIG_TABS[(currentIdx - 1 + CONFIG_TAB_COUNT) % CONFIG_TAB_COUNT];
          });
          return;
        }

        if (selectedRowRef.current === 0) {
          setSelectedIndex((prev) => circularPrev(prev, DIFFICULTY.length));
        }

        if (selectedRowRef.current === 1) {
          setSelectedIndex((prev) =>
            circularPrev(prev, DIALOGUE_SPEED_LIST.length),
          );
        }

        if (selectedRowRef.current === 2) {
          setSfxVolumeRef.current(Math.max(sfxVolume - 10, 0));
        }

        if (selectedRowRef.current === 3) {
          setBgmVolumeRef.current(Math.max(bgmVolume - 10, 0));
        }

        if (selectedRowRef.current === 4) {
          setBottomIndex((prev) => (prev - 1 + BOTTOM_COUNT) % BOTTOM_COUNT);
        }
      },

      onDown: () => {
        if (screenRef.current !== "menu") return;

        playMoveRef.current();

        if (isOnTabRef.current) {
          setIsOnTab(false);
          setSelectedRow(0);
          return;
        }

        if (selectedRowRef.current === 4) {
          setSelectedRow(0);
          return;
        }

        setSelectedRow((prev) => Math.min(prev + 1, MAX_ROW));
      },

      onUp: () => {
        if (screenRef.current !== "menu") return;

        playMoveRef.current();

        if (isOnTabRef.current) return;

        if (selectedRowRef.current === 4) {
          setSelectedRow(3);
          return;
        }

        if (selectedRowRef.current === 0) {
          setIsOnTab(true);
          return;
        }

        setSelectedRow((prev) => Math.max(prev - 1, 0));
      },

      onConfirm: () => {
        if (screenRef.current !== "menu") return true;
        if (isOnTabRef.current) return true;

        playSelectRef.current();

        if (selectedRowRef.current === 0) {
          const selected = getSelected(DIFFICULTY, selectedIndexRef.current);
          setDifficultyRef.current(selected);
        }

        if (selectedRowRef.current === 1) {
          const selected = getSelected(
            DIALOGUE_SPEED_LIST,
            selectedIndexRef.current,
          );
          setDialogueSpeedRef.current(selected);
        }

        if (selectedRowRef.current === 4) {
          const idx = bottomIndexRef.current;

          if (idx === 0) {
            setShowQuestIndicatorRef.current(!showQuestIndicator);
          }

          if (idx === 1) {
            setScreen("tutorial");
          }

          if (idx === 2) {
            checkForUpdateRef.current();
          }

          if (idx === 3) {
            if (isInstalledRef.current) {
              setShowInstalledMessageRef.current(true);
            } else if (canInstallRef.current) {
              installRef.current();
            } else {
              setShowNotAvailableMessageRef.current(true);
            }
          }
        }

        onConfirmRef.current?.();

        return true;
      },

      onCancel: () => {
        playCloseRef.current();
        if (screenRef.current === "tutorial") {
          setScreen("menu");
          return true;
        }

        return false;
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);

    return () => popControlsRef.current();
  }, [isActive, sfxVolume, bgmVolume, showQuestIndicator, setShowQuestIndicator]);

  return {
    difficulty: DIFFICULTY,
    selectedIndex,
    selectedRow,
    bottomIndex,
    screen,
    showQuestIndicator,
    activeTab,
    isOnTab,
  };
}
