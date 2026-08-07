import { useMemo, useState, useCallback, useRef } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { DIRECTOR_SCENES } from "@/scenes/director";
import { createDirector } from "@/interactions/director";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuestActions } from "@/hooks/quest/useQuestActions";
import { useFlags } from "@/contexts/FlagContext";
import { useNavigate, useLocation } from "react-router";
import { asset } from "@/utils/paths";
import { useAudio } from "@/contexts/AudioContext";

import { sceneBackgrounds } from "@/data/scene/background";

import Talking from "@/components/Talking";

type Props = {
  sceneId: SceneId;
};

export function DirectorScene({ sceneId }: Props) {
  const scene = DIRECTOR_SCENES[sceneId];
  const navigate = useNavigate();
  const location = useLocation();

  const { addItem, hasItem, removeItem } = useInventory();
  const { progressQuest } = useQuestActions();
  const { hasFlag, setFlag } = useFlags();

  const [popup, setPopup] = useState<string | null>(null);
  const gotKey = hasFlag("picked_director_key");

  const { sfxVolume } = useAudio();
  const sfxVolumeRef = useRef(sfxVolume);
  sfxVolumeRef.current = sfxVolume;

  const playSFX = useCallback((src: string, volume = 1) => {
    const audio = new Audio(asset(src));
    audio.volume = volume * (sfxVolumeRef.current / 100);
    audio.play().catch(() => {});
  }, []);

  const navigateFrom = useCallback(
    (to: string) => {
      navigate(to, { state: { from: location.pathname } });
    },
    [navigate, location.pathname],
  );

  const interactions = useMemo(
    () =>
      createDirector({
        hasItem,
        addItem,
        removeItem,
        navigate: navigateFrom,
        setPopup: (msg) => setPopup(msg),
        gotKey,
        setFlag,
        progressQuest,
        playSFX,
      }),
    [
      hasItem,
      addItem,
      removeItem,
      navigateFrom,
      gotKey,
      setFlag,
      progressQuest,
      playSFX,
    ],
  );

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        background={sceneBackgrounds.Director}
        interactions={interactions}
        itemPickupTiles={[
          { x: 18, y: 4, height: 2, visible: !gotKey },
        ]}
        popup={popup}
        setPopup={setPopup}
      />

      {/* ✅ popup continua fora */}
      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
