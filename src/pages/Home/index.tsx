import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import undertale from "/assets/songs/background/UndertaleGameOver.m4a";
import { useBackgroundAudio } from "@/hooks/useBackgroundAudio";
import { asset } from "@/utils/paths";
import { loadGame } from "@/services/save/saveService";
import { hasAnySave } from "@/services/save/slotManager";
import { sceneBackgrounds } from "@/data/scene/background";
import { useFlags } from "@/contexts/FlagContext";
import {
  CANTINA_ROUTES,
  JOMASIO_ENTRANCE_ROUTES,
} from "@/scenes/shared/routes";
import { ParticlesBackground } from "@/components/ParticlesBackground";

function isJomasioEntranceRoute(route: string): boolean {
  return route.toLowerCase().startsWith("/jomasioentrance");
}

export default function Home() {
  const navigate = useNavigate();
  const { pushControls } = useGameControls();
  const { hasFlag } = useFlags();

  useBackgroundAudio(undertale);

  useEffect(() => {
    if (!hasAnySave()) {
      void navigate("/tutorial", { replace: true });
      return;
    }
  }, [navigate]);

  const handleConfirm = useCallback(() => {
    const save = loadGame();
    const startedChapterOne = hasFlag("chapterOne");
    const fallbackRoute = startedChapterOne
      ? CANTINA_ROUTES.ONE
      : JOMASIO_ENTRANCE_ROUTES.ONE;

    if (
      save?.lastRoute &&
      save.lastRoute !== "/home" &&
      save.lastRoute !== "/combatTutorial" &&
      !save.lastRoute.startsWith("/replay") &&
      !save.lastRoute.includes("battle") &&
      !(startedChapterOne && isJomasioEntranceRoute(save.lastRoute))
    ) {
      void navigate(save.lastRoute);
    } else {
      void navigate(fallbackRoute);
    }
  }, [navigate, hasFlag]);

  useEffect(() => {
    const remove = pushControls({
      onConfirm: handleConfirm,
    });

    return remove;
  }, [pushControls, handleConfirm]);

  return (
    <div
      className="Master"
      style={{ backgroundImage: `url(${sceneBackgrounds.Home})` }}
    >
      <img src={asset("/assets/logo.svg")} alt="logo" className={styles.logo} />
      <p className={styles.continue}>Faça o L para continuar</p>
      <ParticlesBackground />
    </div>
  );
}
