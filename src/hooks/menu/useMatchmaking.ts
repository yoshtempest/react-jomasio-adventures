import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

const OPTIONS = ["Criar Sala", "Entrar na Sala"];

export function useMatchmakingMenu() {
  const navigate = useNavigate();
  const { pushControls } = useGameControls();
  const { playMove, playSelect, playClose } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [roomCode, setRoomCode] = useState("");
  const [typing, setTyping] = useState(false); // 🔥 controla input ativo

  const selectedIndexRef = useRef(selectedIndex);
  const typingRef = useRef(typing);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    typingRef.current = typing;
  }, [selectedIndex, typing]);

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const playCloseRef = useRef(playClose);
  playCloseRef.current = playClose;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;

  useEffect(() => {
    const controls = {
      onUp: () => {
        if (typingRef.current) return;

        playMoveRef.current();
        setSelectedIndex((prev) => circularPrev(prev, OPTIONS.length));
      },

      onDown: () => {
        if (typingRef.current) return;

        playMoveRef.current();
        setSelectedIndex((prev) => circularNext(prev, OPTIONS.length));
      },

      onConfirm: () => {
        const index = selectedIndexRef.current;

        playSelectRef.current();

        // 👉 Criar sala
        if (index === 0) {
          const code = generateRoomCode();
          navigate(`/room/${code}`);
        }

        // 👉 Entrar na sala
        if (index === 1) {
          if (!roomCode) return;

          navigate(`/room/${roomCode}`);
        }

        return true;
      },

      onCancel: () => {
        // 🔥 se estiver digitando, sai do input
        if (typingRef.current) {
          setTyping(false);
          return;
        }

        playCloseRef.current();
        navigate("/");
      },

      blockGlobalOpen: true,
    };

    const remove = pushControlsRef.current(controls);
    return () => remove();
  }, [roomCode, navigate]);

  return {
    selectedIndex,
    options: OPTIONS,
    roomCode,
    setRoomCode,
    typing,
    setTyping,
  };
}

// 🔥 gerador simples de código
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}
