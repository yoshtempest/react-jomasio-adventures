import { cafeteria } from "@/maps/cafeteria";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { cafeteriaDialogue } from "@/data/maps/cafeteria/one";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { director } from "@/maps/director";
import Talking from "@/components/Talking";
import { useGameControls } from "@/contexts/GameControlsContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { useInventory } from "@/contexts/InventoryContext";
import { createCafeteria } from "@/interactions/cafeteira";
import toothlessDancing from "@/assets/songs/ToothlessDancing.m4a"

export default function BrodiClassOne() {
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
    <div className="Master brodiClass">
      <ExploreScene
        map={cafeteria}
        dialogueData={cafeteriaDialogue} 
        nextRoute={"/cafeteria/battle"}
        initialPosition={{ x: 4, y: 4, direction: "down" }}
        audio={{
          src: toothlessDancing,
          loop: true,
          volume: 0.5,
        }}
        transitions={[
          {
            positions: [{ x: 8, y: 11 }],
            to: "/cantina/four",
          },
        ]}
        npcs={[
          {
            src: "/src/assets/player/samuel/movement/right.svg",
            gridX: 6,
            gridY: 6,
          },
          {
            src: "/src/assets/player/riquelme/movement/down.svg",
            gridX: 9,
            gridY: 4,
          },
          {
            src: "/src/assets/player/lucaua/movement/right.svg",
            gridX: 2,
            gridY: 7,
          },
          {
            src: "/src/assets/player/marcelo/movement/up.svg",
            gridX: 8,
            gridY: 8,
          },
          {
            src: "/src/assets/player/emanuel/default.svg",
            gridX: 14,
            gridY: 4,
          },
          {
            src: "/src/assets/player/artur/movement/down.svg",
            gridX: 7,
            gridY: 4,
          },
          {
            src: "/src/assets/player/lucas/default.svg",
            gridX: 11,
            gridY: 4,
          },
          {
            src: "/src/assets/player/larissa/movement/up.svg",
            gridX: 15,
            gridY: 10,
          },
          {
            src: "/src/assets/player/eduarda/movement/up.svg",
            gridX: 14,
            gridY: 10,
          },
          {
            src: "/src/assets/player/mayra/default.svg",
            gridX: 13,
            gridY: 9,
          },
          {
            src: "/src/assets/player/camilly/default.svg",
            gridX: 14,
            gridY: 8,
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