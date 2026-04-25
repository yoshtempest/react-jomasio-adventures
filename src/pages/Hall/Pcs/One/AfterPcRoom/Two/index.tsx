import { hallOne } from "@/maps/hall/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { AfterPcRoomTwoDialogue } from "@/data/maps/hall/one/afterPcRoom/two";  

import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect, useState, useMemo, useRef } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { getTileInFront } from "@/utils/getTileInFront";
import Talking from "@/components/Talking";
import { createHallOne } from "@/interactions/hallAfterPcRoom";


export default function AfterPcRoomTwo() {

  const { player } = usePlayer();

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem, removeItem } = useInventory();

  const { pushControls, popControls } = useGameControls();

  const handlerRef = useRef<() => void>(() => {});

  handlerRef.current = () => {
      if (popup) {
        setPopup(null);
        return;
      }
  
      const { x, y } = getTileInFront(player, hallOne);
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
    createHallOne({
      hasItem,
      addItem,
      removeItem,
      setPopup: (msg) => setPopup(msg),
    }),
  [
    hasItem,
    addItem,
    removeItem,
  ]);
  return (
    <div className={`Master HallOne`}>
      <ExploreScene
        map={hallOne}
        dialogueData={AfterPcRoomTwoDialogue} 
        initialPosition={{ x: 2, y: 9, direction: "left" }}
        npcs={[
          {
            src: "/src/assets/npcs/remedinha/default.svg",
            gridX: 1,
            gridY: 9,
          },
        ]}
        transitions={[
          {
            positions: [
              { x: 1, y: 10 },
            ],
            to: "/hall/left/one",
          },
          {
            positions: [{ x: 13, y: 7 }],
            to: "/pcroom/seven",
          },
          {
            positions: [
              { x: 7, y: 2 },
              { x: 8, y: 2 },
              { x: 9, y: 2 },
            ],
            to: "/hall/two",
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