import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import type { ReactNode } from "react";

import type { GameControlLayer } from "@/utils/types/player/controls";

import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";

import { shouldConsumeInput } from "@/gameRules/movement/input";
import { useGameKeyboard } from "@/hooks/game/useGameKeyboard";

type Props = {
  children: ReactNode;
};

type ControlsContextType = {
  pushControls: (controls: GameControlLayer) => () => void;
  clearControls: () => void;
  closeAllMenus: () => void;
  activeControls: GameControlLayer;
};

const GameControlsContext = createContext<ControlsContextType | null>(null);

export function GameControlsProvider({ children }: Props) {
  const [stack, setStack] = useState<GameControlLayer[]>([]);

  const { player, restoreMode } = usePlayer();

  const {
    openNavbar,
    closeNavbar,
    openConfigScreen,
    openInventoryScreen,
    openQuestsScreen,
    openProfessionsScreen,
    openTitlesScreen,
    openEquipmentScreen,
    isNavOpen,
    screen,
  } = useNavbar();

  // REFS

  const restoreModeRef = useRef(restoreMode);
  restoreModeRef.current = restoreMode;

  const playerModeRef = useRef(player.mode);
  playerModeRef.current = player.mode;

  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;

  const isNavOpenRef = useRef(isNavOpen);
  isNavOpenRef.current = isNavOpen;

  const screenRef = useRef(screen);
  screenRef.current = screen;

  // CONTROLS STACK

  const pushControls = useCallback(
    (controls: GameControlLayer) => {
      setStack((prev) => [...prev, controls]);

      return () => {
        setStack((prev) =>
          prev.filter((layer) => layer !== controls),
        );
      };
    },
    [],
  );

  const clearControls = useCallback(() => {
    setStack([]);
  }, []);

  const closeAllMenus = useCallback(() => {
    closeNavbarRef.current();
    restoreModeRef.current();
  }, []);

  // ACTIVE CONTROLS

  const activeControls = useMemo((): GameControlLayer => {
    const top = stack[stack.length - 1];

    return {
      onUp: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onUp?.();

          if (shouldConsumeInput(handled)) {
            break;
          }
        }
      },

      onDown: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onDown?.();

          if (shouldConsumeInput(handled)) {
            break;
          }
        }
      },

      onLeft: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onLeft?.();

          if (shouldConsumeInput(handled)) {
            break;
          }
        }
      },

      onRight: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onRight?.();

          if (shouldConsumeInput(handled)) {
            break;
          }
        }
      },

      onConfirm: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onConfirm?.();

          if (shouldConsumeInput(handled)) {
            break;
          }
        }
      },

      onCancel: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onCancel?.();

          if (shouldConsumeInput(handled)) {
            break;
          }
        }
      },

      onConfirmRelease:
        top?.onConfirmRelease,

      onCancelRelease:
        top?.onCancelRelease,

      onUpRelease:
        top?.onUpRelease,

      onDownRelease:
        top?.onDownRelease,

      onLeftRelease:
        top?.onLeftRelease,

      onRightRelease:
        top?.onRightRelease,

      onOpen: top?.onOpen,

      blockGlobalOpen:
        top?.blockGlobalOpen ?? false,
    };
  }, [stack]);

  // KEYBOARD

  const activeControlsRef = useRef(activeControls);
  activeControlsRef.current = activeControls;

  useGameKeyboard({
    controlsRef: activeControlsRef,
    playerModeRef,
    isNavOpenRef,
    screenRef,

    openNavbar,
    closeAllMenus,

    closeNavbar,
    openConfigScreen,
    openInventoryScreen,
    openQuestsScreen,
    openProfessionsScreen,
    openTitlesScreen,
    openEquipmentScreen,
  });

  // PROVIDER

  return (
    <GameControlsContext.Provider
      value={{
        pushControls,
        clearControls,
        closeAllMenus,
        activeControls,
      }}
    >
      {children}
    </GameControlsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGameControls() {
  const ctx = useContext(GameControlsContext);

  if (!ctx) {
    throw new Error(
      "useGameControls need provider",
    );
  }

  return ctx;
}