import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import undertale from "/assets/songs/background/UndertaleGameOver.m4a";
import { useBackgroundAudio } from "@/hooks/useBackgroundAudio";
import { asset } from "@/utils/paths";
import { loadGame } from "@/utils/save/saveGame";
import { hasAnySave } from "@/utils/save/slotManager";
import { sceneBackgrounds } from "@/data/scene/background";

export default function Home() {
  const navigate = useNavigate();
  const { pushControls } = useGameControls();

  useBackgroundAudio(undertale);

  useEffect(() => {
    if (!hasAnySave()) {
      navigate("/tutorial", { replace: true });
      return;
    }
  }, [navigate]);

  const handleConfirm = useCallback(() => {
    const save = loadGame();
    if (
      save?.lastRoute &&
      save.lastRoute !== "/home" &&
      save.lastRoute !== "/combatTutorial" &&
      !save.lastRoute.startsWith("/replay") &&
      !save.lastRoute.includes("battle")
    ) {
      navigate(save.lastRoute);
    } else {
      navigate("/firstscreen");
    }
  }, [navigate]);

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
      <img src={asset("/assets/logo.svg")} alt="logo" className="logo" />
      <p className={styles.continue}>Faça o L para continuar</p>
    </div>
  );
}
