import { useEffect, useMemo, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { director } from "@/maps/director";
import Talking from "@/components/Talking";
import { useGameControls } from "@/contexts/GameControlsContext";
import { getTileInFront } from "@/utils/getTileInFront";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavigate } from "react-router";
import { createDirector } from "@/interactions/director";
import { Scene } from "@/components/Scene";

export default function DirectorTwo() {
  const { player, setMap } = usePlayer();
  const { setOnConfirm } = useGameControls();

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem, removeItem } = useInventory();
  const navigate = useNavigate();
  const [gotKey, setGotKey] = useState(false);

  useEffect(() => {
    setMap(director);
  }, []);

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
    }),
  [
    hasItem,
    addItem,
    removeItem,
    navigate,
    gotKey,
  ]);

  useEffect(() => {

    setOnConfirm(() => () => {
      // 🔁 fechar popup
      if (popup) {
        setPopup(null);
        return;
      }

      const { x, y } = getTileInFront(player, director);

      const interaction = interactionsByPosition[`${x},${y}`];

      if (interaction) {
        interaction();
        return;
      }
    });

    return () => setOnConfirm(undefined);
  }, [player, popup]);

  return (
    <div className={`Master Director`}>
      <Scene
        map={director}
        className={`Master Director`}
        initialPosition={{ x: 9, y: 5, direction: "up" }}
        transitions={[
          {
            positions: [
              { x: 17, y: 17 },
            ],
            to: "/cantina/two",
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