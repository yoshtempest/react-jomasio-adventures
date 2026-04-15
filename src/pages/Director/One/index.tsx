import { useEffect, useMemo, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { blocked } from "@/maps/blocked";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import { NPC } from "@/components/Game/Npc";
import Talking from "@/components/Talking";
import { useCutscene } from "@/hooks/useCutscene";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSansTalking } from "@/hooks/useSansTalking";
import { useGameControls } from "@/contexts/GameControlsContext";
import { directorDialogue } from "@/data/maps/director/one";
import { useNavigate } from "react-router";

export default function Director() {
  const { player, setMap, setPosition } = usePlayer();
  const { play: playSansTalking } = useSansTalking(false);
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();

  const [popup, setPopup] = useState<string | null>(null);

  const cutscene = useCutscene({
    dialogue: directorDialogue,
    playAudio: playSansTalking,
  });

  const backgroundAudio = useMemo(() => ({
    src: LavenderTown,
    loop: true,
    volume: 0.5,
  }), []);

  useGameAudio(backgroundAudio);

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(blocked);
    setPosition(9, 5, "up");
  }, []);

  const [cutsceneStarted, setCutsceneStarted] = useState(false);

  useEffect(() => {
    if (cutscene.isOpen) {
      setCutsceneStarted(true);
    }
  }, [cutscene.isOpen]);

  useEffect(() => {
    if (!cutscene.isOpen && cutsceneStarted) {
      navigate("/director/two");
    }
  }, [cutscene.isOpen, cutsceneStarted]);

  useEffect(() => {
    // cutscene já controla input → não interferir
    if (cutscene.isOpen) return;

    setOnConfirm(() => () => {
      // 🔁 fechar popup
      if (popup) {
        setPopup(null);
        return;
      }
    });

    return () => setOnConfirm(undefined);
  }, [player, popup, cutscene.isOpen]);

  return (
    <div className={`Master Director`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPC
          src="/src/assets/npcs/system/default.svg"
          gridX={9}
          gridY={4}
          TILE_SIZE={TILE_SIZE}
        />
        <Player
          direction={player.direction}
          gridX={player.gridX}
          gridY={player.gridY}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
        />
      </GameMap>

      {cutscene.isOpen && (
        <Talking
          src={cutscene.dialogue.src}
          name={cutscene.dialogue.name}
          message={cutscene.dialogue.message}
        />
      )}
    </div>
  );
}