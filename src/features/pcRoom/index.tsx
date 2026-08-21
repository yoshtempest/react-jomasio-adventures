import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { PCROOM_SCENES } from "@/scenes/pcroom";
import { createPcsRoom } from "@/interactions/pcsRoom";

import { useInventory } from "@/contexts/InventoryContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useQuestActions } from "@/hooks/quest/useQuestActions";
import { useFlags } from "@/contexts/FlagContext";

import { useClassSelection } from "@/hooks/menu/useClassSelection";

import Talking from "@/components/Talking";
import { sceneBackgrounds } from "@/data/scene/background";

import styles from "./styles.module.css";

type Props = {
  sceneId: SceneId;
};

export function PcRoomScene({ sceneId }: Props) {
  const scene = PCROOM_SCENES[sceneId];

  const navigate = useNavigate();
  const location = useLocation();

  const { setMode } = usePlayer();
  const { addItem } = useInventory();
  const { giveQuest, progressQuest } = useQuestActions();
  const { hasFlag, setFlag } = useFlags();

  const [showClassModal, setShowClassModal] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);
  const gotKey = hasFlag("picked_desired_gear");

  // ✅ sistema de seleção de classe
  const { classes, selectedIndex } = useClassSelection(showClassModal, () => {
    setShowClassModal(false);
    setMode("explore");
    void navigate("/pcroom/two", {
      state: { from: location.pathname },
    });
  });

  const setModeRef = useLatestRef(setMode);

  // ✅ controla modo do player
  useEffect(() => {
    if (showClassModal) {
      setModeRef.current("select");
    } else {
      setModeRef.current("explore");
    }
  }, [showClassModal, setModeRef]);

  // ✅ interações da sala
  const interactions = useMemo(
    () =>
      createPcsRoom({
        addItem,
        setPopup,
        gotKey,
        setFlag,
      }),
    [addItem, gotKey, setFlag],
  );

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        background={sceneBackgrounds.PcsRoom}
        interactions={interactions}
        itemPickupTiles={[
          { x: 10, y: 7, visible: !gotKey, image: "/assets/items/desired_gear.svg" },
        ]}
        popup={popup}
        setPopup={setPopup}
        // 🔥 equivalente ao onFinish antigo
        onFinishExtra={() => ({
          setShowClassModal,
          progressQuest,
          giveQuest,
          addItem,
        })}
      />

      {/* 🧠 MODAL (continua fora do SceneBase) */}
      {showClassModal && (
        <div className={`overlay ${styles.classModal}`}>
          <h1>Escolha sua classe</h1>

          <div className={styles.classList}>
            {classes.map((cls, index) => (
              <div
                key={cls}
                className={`${styles.classItem} ${
                  index === selectedIndex ? styles.selected : ""
                }`}
              >
                {index === selectedIndex && <span className="cursor">▼</span>}

                <h3>{cls}</h3>

                {cls === "fracote" && <p>-1 no deliciômetro</p>}
                {cls === "idiota" && <p>-8% dano recebido</p>}
                {cls === "amostradinho" && <p>+1% dano causado</p>}
              </div>
            ))}
          </div>

          <p>
            Sua classe influencia todos os personagens e pode ser alterada
            futuramente
          </p>
        </div>
      )}

      {/* 💬 popup */}
      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
