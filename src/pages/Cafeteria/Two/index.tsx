import { cafeteria } from "@/maps/cafeteria";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { cafeteriaTwoDialogue } from "@/data/maps/cafeteria/two";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { director } from "@/maps/director";
import Talking from "@/components/Talking";
import { useGameControls } from "@/contexts/GameControlsContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { useInventory } from "@/contexts/InventoryContext";
import { createCafeteria } from "@/interactions/cafeteira";

export default function CafeteriaTwo() {
  const { player } = usePlayer();

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
  }, []);

  // 🧠 Interações por posição
  const interactionsByPosition = useMemo(() =>
    createCafeteria({
      hasItem,
      addItem,
      removeItem,
      setPopup: (msg) => setPopup(msg),
      gotKey,
      setGotKey,
    }),
  [
    hasItem,
    addItem,
    removeItem,
    gotKey,
  ]);
  return (
    <div className="Master Cafeteria">
      <ExploreScene
        map={cafeteria}
        dialogueData={cafeteriaTwoDialogue} 
        nextRoute={"/cafeteria/battle"}
        initialPosition={{ x: 9, y: 10, direction: "up" }}
        transitions={[
          {
            positions: [{ x: 8, y: 11 }],
            to: "/cantina/four",
          },
        ]}
        npcs={[
          {
            src: "/src/assets/npcs/deise/default.svg",
            gridX: 14,
            gridY: 5,
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