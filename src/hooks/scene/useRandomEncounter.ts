import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { slotKey } from "@/utils/save/slotManager";
import type {
  RandomEncounterConfig,
  EncounterDef,
} from "@/utils/types/battle/randomEncounter";

function pickEncounter(encounters: EncounterDef[]): string {
  const totalWeight = encounters.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const e of encounters) {
    roll -= e.weight;
    if (roll <= 0) return e.route;
  }
  return encounters[encounters.length - 1].route;
}

export function useRandomEncounter(config: RandomEncounterConfig) {
  const configRef = useRef(config);
  configRef.current = config;

  const { player, setPosition } = usePlayer();
  const navigate = useNavigate();

  const lastPositionRef = useRef({ x: player.gridX, y: player.gridY });
  const setPositionRef = useRef(setPosition);
  setPositionRef.current = setPosition;
  const restoringRef = useRef(false);

  useEffect(() => {
    const { storageKey } = configRef.current;
    const saved = localStorage.getItem(slotKey(storageKey));
    if (!saved) return;

    restoringRef.current = true;
    const { x, y, direction } = JSON.parse(saved);
    lastPositionRef.current = { x, y };
    setPositionRef.current(x, y, direction);

    requestAnimationFrame(() => {
      setPositionRef.current(x, y, direction);
      localStorage.removeItem(slotKey(storageKey));
      restoringRef.current = false;
    });
  }, []);

  const playerRef = useRef(player);
  playerRef.current = player;

  useEffect(() => {
    const currentPlayer = playerRef.current;
    const { gridX, gridY } = currentPlayer;

    const moved =
      gridX !== lastPositionRef.current.x ||
      gridY !== lastPositionRef.current.y;
    if (!moved) return;

    if (restoringRef.current) {
      lastPositionRef.current = { x: gridX, y: gridY };
      return;
    }

    lastPositionRef.current = { x: gridX, y: gridY };

    if (currentPlayer.mode !== "explore") return;

    const cfg = configRef.current;
    const isBlocked =
      cfg.blockedTiles?.some((t) => t.x === gridX && t.y === gridY) ?? false;
    if (isBlocked) return;

    const savePosition = () => {
      localStorage.setItem(
        slotKey(cfg.storageKey),
        JSON.stringify({
          x: currentPlayer.gridX,
          y: currentPlayer.gridY,
          direction: currentPlayer.direction,
        }),
      );
    };

    if (Math.random() < (cfg.alfaChance ?? 0)) {
      const route = pickEncounter(cfg.encounters);
      savePosition();
      navigate(route, { state: { alfa: true } });
      return;
    }

    if (Math.random() < (cfg.encounterChance ?? 0.1)) {
      savePosition();
      const route = pickEncounter(cfg.encounters);
      navigate(route);
    }
  }, [player.gridX, player.gridY, navigate]);
}
