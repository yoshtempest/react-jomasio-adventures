import { itemPath } from "@/utils/paths";
import type { MessageCardConfig } from "@/utils/types/interaction";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { PCROOM_SCENES } from "@/scenes/pcroom";
import { createPcsRoom } from "@/interactions/pcsRoom";

import { useInventory } from "@/contexts/InventoryContext";
import { usePlayerActions } from "@/contexts/PlayerContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useQuestActions } from "@/hooks/quest/useQuestActions";
import { useFlags } from "@/contexts/FlagContext";

import { useClassSelection } from "@/hooks/menu/useClassSelection";

import Talking from "@/components/Game/Interactions/Talking";
import { MessageCard } from "@/components/Game/Interactions/MessageCard";
import { sceneBackgrounds } from "@/data/scene/background";
import { ImageModal } from "@/components/Game/Interactions/ImageModal";

import styles from "./styles.module.css";
import { JANDERSON_IDLE_SPRITE, useJandersonExit } from "./useJandersonExit";

type Props = {
  sceneId: SceneId;
};

export function PcRoomScene({ sceneId }: Props) {
  const scene = PCROOM_SCENES[sceneId];

  const navigate = useNavigate();
  const location = useLocation();

  const { setMode } = usePlayerActions();
  const { addItem } = useInventory();
  const { giveQuest, progressQuest } = useQuestActions();
  const { hasFlag, setFlag } = useFlags();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageMessage, setImageMessage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageMusic, setImageMusic] = useState<string | null>(null);

  const [showClassModal, setShowClassModal] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);
  const [messageCardConfig, setMessageCardConfig] =
    useState<MessageCardConfig | null>(null);
  const gotKey = hasFlag("picked_desired_gear");

  /**
   * A interação "Mosquito orquestra ao vivo" pede uma trilha própria; com o
   * modal aberto ela substitui a música da cena, e ao fechar a cena volta a
   * tocar a dela.
   */
  const audioOverride = useMemo<AudioConfig | undefined>(
    () => (imageMusic ? { src: imageMusic } : undefined),
    [imageMusic],
  );

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
        showMessageCard: (config) => {
          setMessageCardConfig(config);
        },
        showImage: (src, message, name, music) => {
          setImageSrc(src);
          setImageMessage(message ?? null);
          setImageName(name ?? null);
          setImageMusic(music ?? null);
        },
      }),
    [addItem, gotKey, setFlag],
  );

  // ── Saída do Janderson ──
  // Ele só sai andando enquanto o jogador está escolhendo a classe depois do
  // diálogo; fora disso volta a ficar parado no tile original.
  const isClassScene = sceneId === "one";
  const {
    id: jandersonId,
    src: jandersonSrc,
    gridX: jandersonX,
    gridY: jandersonY,
    moveMs: jandersonMoveMs,
  } = useJandersonExit(showClassModal && isClassScene);

  const sceneWithJanderson = useMemo(() => {
    if (!scene) return null;
    if (!isClassScene) return scene;

    return {
      ...scene,
      npcs: (scene.npcs ?? []).map((npc) =>
        npc.src === JANDERSON_IDLE_SPRITE
          ? {
              ...npc,
              id: jandersonId,
              src: jandersonSrc,
              gridX: jandersonX,
              gridY: jandersonY,
              moveMs: jandersonMoveMs,
            }
          : npc,
      ),
    };
  }, [
    scene,
    isClassScene,
    jandersonId,
    jandersonSrc,
    jandersonX,
    jandersonY,
    jandersonMoveMs,
  ]);

  if (!sceneWithJanderson) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={sceneWithJanderson}
        background={sceneBackgrounds.PcsRoom}
        audioOverride={audioOverride}
        interactions={interactions}
        itemPickupTiles={[
          {
            x: 10.6,
            y: 6.5,
            size: 0.5,
            visible: !gotKey,
            image: itemPath("desired_gear.svg"),
          },
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

      {imageSrc && (
        <ImageModal
          src={imageSrc}
          message={imageMessage ?? undefined}
          name={imageName ?? undefined}
          onClose={() => {
            setImageSrc(null);
            setImageMessage(null);
            setImageName(null);
            setImageMusic(null);
          }}
        />
      )}

      {messageCardConfig && (
        <MessageCard
          title={messageCardConfig.title}
          subtitle={messageCardConfig.subtitle}
          description={messageCardConfig.description}
          numberedCount={messageCardConfig.numberedCount}
          onClose={() => setMessageCardConfig(null)}
        />
      )}
    </>
  );
}
