import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { useAudio } from "@/contexts/AudioContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useSettings } from "@/contexts/SettingsContext";
import { DIALOGUE_SPEED_LIST } from "@/utils/settings";

const DIFFICULTY: NpcDifficulty[] = ["easy", "medium", "hard"];
const MAX_ROW = 5;

export function useConfigSelection(isActive: boolean, onConfirm?: () => void) {
  const { pushControls, popControls } = useGameControls();

  const { setDifficulty } = usePlayer();
  const { sfxVolume, setSfxVolume, bgmVolume, setBgmVolume } = useAudio();
  const { setDialogueSpeed, showQuestIndicator, setShowQuestIndicator } = useSettings();
  const { playMove, playSelect, playClose } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);

  // 0 = dificuldade
  // 1 = volume SFX
  // 2 = volume BGM
  // 3 = velocidade do diálogo
  // 4 = indicador de missão
  // 5 = tutorial
  const [selectedRow, setSelectedRow] = useState(0);

  // menu | tutorial
  const [screen, setScreen] = useState<"menu" | "tutorial">("menu");

  const selectedIndexRef = useRef(selectedIndex);
  const selectedRowRef = useRef(selectedRow);
  const screenRef = useRef(screen);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    selectedRowRef.current = selectedRow;
    screenRef.current = screen;
  }, [selectedIndex, selectedRow, screen]);

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
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  useEffect(() => {
    if (!isActive) return;

    const controls = {
      onRight: () => {
        if (screenRef.current !== "menu") return;
        playMoveRef.current();

        if (selectedRowRef.current === 0) {
          setSelectedIndex((prev) => circularNext(prev, DIFFICULTY.length));
        }

        if (selectedRowRef.current === 1) {
          setSfxVolumeRef.current(Math.min(sfxVolume + 10, 100));
        }

        if (selectedRowRef.current === 2) {
          setBgmVolumeRef.current(Math.min(bgmVolume + 10, 100));
        }

        if (selectedRowRef.current === 3) {
          setSelectedIndex((prev) =>
            circularNext(prev, DIALOGUE_SPEED_LIST.length),
          );
        }

        if (selectedRowRef.current === 4) {
          setShowQuestIndicatorRef.current(true);
        }
      },

      onLeft: () => {
        if (screenRef.current !== "menu") return;
        playMoveRef.current();

        if (selectedRowRef.current === 0) {
          setSelectedIndex((prev) => circularPrev(prev, DIFFICULTY.length));
        }

        if (selectedRowRef.current === 1) {
          setSfxVolumeRef.current(Math.max(sfxVolume - 10, 0));
        }

        if (selectedRowRef.current === 2) {
          setBgmVolumeRef.current(Math.max(bgmVolume - 10, 0));
        }

        if (selectedRowRef.current === 3) {
          setSelectedIndex((prev) =>
            circularPrev(prev, DIALOGUE_SPEED_LIST.length),
          );
        }

        if (selectedRowRef.current === 4) {
          setShowQuestIndicatorRef.current(false);
        }
      },

      onDown: () => {
        if (screenRef.current !== "menu") return;

        playMoveRef.current();
        setSelectedRow((prev) => Math.min(prev + 1, MAX_ROW));
      },

      onUp: () => {
        if (screenRef.current !== "menu") return;

        playMoveRef.current();
        setSelectedRow((prev) => Math.max(prev - 1, 0));
      },

      onConfirm: () => {
        if (screenRef.current !== "menu") return true;

        playSelectRef.current();

        // dificuldade
        if (selectedRowRef.current === 0) {
          const selected = getSelected(DIFFICULTY, selectedIndexRef.current);
          setDifficultyRef.current(selected);
        }

        // velocidade do diálogo
        if (selectedRowRef.current === 3) {
          const selected = getSelected(
            DIALOGUE_SPEED_LIST,
            selectedIndexRef.current,
          );
          setDialogueSpeedRef.current(selected);
        }

        // indicador de missão
        if (selectedRowRef.current === 4) {
          setShowQuestIndicatorRef.current(!showQuestIndicator);
        }

        // tutorial
        if (selectedRowRef.current === 5) {
          setScreen("tutorial");
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
  }, [isActive, sfxVolume, bgmVolume]);

  return {
    difficulty: DIFFICULTY,
    selectedIndex,
    selectedRow,
    screen,
    showQuestIndicator,
  };
}
