import { cafeteriaTwo } from "@/maps/cafeteriaTwo";
import { ExploreScene } from "@/components/Game/Scenes/Default";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { director } from "@/maps/director";
import Talking from "@/components/Talking";
import { useGameControls } from "@/contexts/GameControlsContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { useInventory } from "@/contexts/InventoryContext";
import { createCafeteria } from "@/interactions/cafeteira";
import { useQuestActions } from "@/hooks/useQuestActions";

export default function CafeteriaThree() {
  const { player } = usePlayer();
  const { progressQuest } = useQuestActions();

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem, removeItem } = useInventory();
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
    createCafeteria({
      hasItem,
      addItem,
      removeItem,
      setPopup: (msg) => setPopup(msg),
      gotKey,
      setGotKey,
      progressQuest,
    }),
  [
    hasItem,
    addItem,
    removeItem,
    gotKey,
    progressQuest,
  ]);
  return (
    <div className="Master Cafeteria">
      <ExploreScene
        map={cafeteriaTwo}
        transitions={[
          {
            positions: [{ x: 8, y: 11 }],
            to: "/cantina/four",
          },
        ]}
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