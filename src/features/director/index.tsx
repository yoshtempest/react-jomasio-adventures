import { useMemo, useState, useCallback, useRef } from "react";

import { SceneBase } from "@/components/Game/Scenes/Base";
import { DIRECTOR_SCENES } from "@/scenes/director";
import { createDirector } from "@/interactions/director";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuestActions } from "@/hooks/useQuestActions";
import { useNavigate, useLocation } from "react-router";
import { asset } from "@/utils/asset";
import { useAudio } from "@/contexts/AudioContext";

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

  const [popup, setPopup] = useState<string | null>(null);
  const [gotKey, setGotKey] = useState(false);

  const { volume: masterVolume } = useAudio();
  const masterVolumeRef = useRef(masterVolume);
  masterVolumeRef.current = masterVolume;

  const playSFX = useCallback((src: string, volume = 1) => {
    const audio = new Audio(asset(src));
    audio.volume = volume * (masterVolumeRef.current / 100);
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
        setGotKey,
        progressQuest,
        playSFX,
      }),
    [
      hasItem,
      addItem,
      removeItem,
      navigateFrom,
      gotKey,
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
        className="Master Director"
        interactions={interactions}
        popup={popup}
        setPopup={setPopup}
      />

      {/* ✅ popup continua fora */}
      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
