import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { director } from "@/maps/director";
import Talking from "@/components/Talking";
import { useGameControls } from "@/contexts/GameControlsContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavigate } from "react-router";
import { createDirector } from "@/interactions/director";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { useQuestActions } from "@/hooks/useQuestActions";
import { asset } from "@/utils/asset";
import { useAudio } from "@/contexts/AudioContext";

export default function DirectorTwo() {
  const { player } = usePlayer();
  const { progressQuest } = useQuestActions();
  const { volume: masterVolume } = useAudio();

  const playSFX = (src: string, volume = 1) => {
    const audio = new Audio(asset(src));
    audio.volume = volume * (masterVolume / 100);
    audio.play().catch(() => {});
  };

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem, removeItem } = useInventory();
  const navigate = useNavigate();
  const [gotKey, setGotKey] = useState(false);

  const { pushControls, popControls } = useGameControls();

  const handlerRef = useRef<() => void>(() => {});

  handlerRef.current = () => {
    if (popup) {
      setPopup(null);
      return;
    }

    const { x, y } = getTileInFront(player, director);
    const interaction = interactionsByPosition[`${x},${y}`];

    if (interaction) {
      interaction();
    }
  };

  useEffect(() => {
    pushControls({
      onConfirm: () => handlerRef.current(),
    });

    return () => popControls();
  }, [pushControls, popControls]);

  // 🧠 Interações por posição
  const interactionsByPosition = useMemo(() =>
    createDirector({
      hasItem,
      addItem,
      removeItem,
      navigate,
      setPopup: (msg) => setPopup(msg),
      gotKey,
      setGotKey,
      progressQuest,
      playSFX,
    }),
  [
    hasItem,
    addItem,
    removeItem,
    navigate,
    gotKey,
    progressQuest,
  ]);

  return (
    <div className={`Master Director`}>
      <ExploreScene
        map={director}
      />

      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </div>
  );
}