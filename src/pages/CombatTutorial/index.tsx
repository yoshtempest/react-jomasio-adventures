import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import { NPCBattle } from "@/components/Game/Npc/Battle";
import { useNavigate } from "react-router";
import styles from "./styles.module.css";

type Task = "moveLeft" | "moveRight" | "jump" | "attack" | "block" | "done";

export default function CombatTutorial() {
  const navigate = useNavigate();
  const { player, setMode, setBattleCollision, attack: rawAttack } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const { TILE_SIZE, PLAYER_SIZE, offsetX, offsetY, MAP_COLS, MAP_ROWS, scaleX, scaleY } = useGameLayout();

  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;
  const setBattleCollisionRef = useRef(setBattleCollision);
  setBattleCollisionRef.current = setBattleCollision;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const attackRef = useRef(rawAttack);
  attackRef.current = rawAttack;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;

  const [currentTask, setCurrentTask] = useState<Task>("moveLeft");
  const initialX = useRef<number | null>(null);

  useEffect(() => {
    setModeRef.current("battle");
    initialX.current = null; // reset — will be captured on next render
  }, []);

  useEffect(() => {
    if (initialX.current === null) {
      initialX.current = player.x;
    }
  });

  useEffect(() => {
    setBattleCollisionRef.current({ map: null, TILE_SIZE, scaleX, scaleY });
    return () => setBattleCollisionRef.current({ map: null, TILE_SIZE: 0, scaleX: 1, scaleY: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    pushControlsRef.current({
      onConfirm: () => { attackRef.current(); },
      blockGlobalOpen: true,
    });
    return () => popControlsRef.current();
  }, []);

  useEffect(() => {
    if (currentTask !== "moveLeft") return;
    if (player.x <= initialX.current! - 30) setCurrentTask("moveRight");
  }, [player.x, currentTask]);

  useEffect(() => {
    if (currentTask !== "moveRight") return;
    if (player.x >= initialX.current! + 40) {
      setCurrentTask("jump");
      initialX.current = player.x;
    }
  }, [player.x, currentTask]);

  useEffect(() => {
    if (currentTask !== "jump") return;
    if (player.y !== player.groundY) setCurrentTask("attack");
  }, [player.state, player.y, player.groundY, currentTask]);

  useEffect(() => {
    if (currentTask !== "attack") return;
    if (player.state === "preAttack" || player.state === "attack") setCurrentTask("block");
  }, [player.state, currentTask]);

  useEffect(() => {
    if (currentTask !== "block") return;
    if (player.state === "blocked") setCurrentTask("done");
  }, [player.state, currentTask]);

  useEffect(() => {
    if (currentTask !== "done") return;
    const t = setTimeout(() => {
      setModeRef.current("explore");
      navigateRef.current("/home");
    }, 2000);
    return () => clearTimeout(t);
  }, [currentTask]);

  const taskInstructions: Record<Task, { text: string; sub: string }> = {
    moveLeft: { text: "Pressione A ou ← para se mover", sub: "Ande para a esquerda" },
    moveRight: { text: "Pressione D ou → para se mover", sub: "Ande para a direita" },
    jump: { text: "Pressione W ou ↑ para pular", sub: "Pule" },
    attack: { text: "Pressione L para atacar", sub: "Ataque o boneco de treino" },
    block: { text: "Pressione S ou ↓ para bloquear", sub: "Bloqueie" },
    done: { text: "Parabéns!", sub: "Você está pronto para sua jornada!" },
  };

  const instruction = taskInstructions[currentTask];

  return (
    <div className={`Master CombatTutorial`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPCBattle
          x={700}
          y={670}
          TILE_SIZE={TILE_SIZE}
          npcType="dummy"
          state="idle"
          direction="left"
        />

        <PlayerBattle
          character={player.character}
          x={player.x}
          y={player.y}
          PLAYER_SIZE={PLAYER_SIZE}
          state={player.state}
          direction={player.battleDirection}
        />
      </GameMap>

      <div className={styles.overlay}>
        <div className={styles.taskBox}>
          <p className={styles.taskText}>{instruction.text}</p>
          <p className={styles.taskSub}>{instruction.sub}</p>
        </div>

        <div className={styles.steps}>
          {(["moveLeft", "moveRight", "jump", "attack", "block", "done"] as const).map((t) => {
            const order: Record<Task, number> = { moveLeft: 1, moveRight: 2, jump: 3, attack: 4, block: 5, done: 6 };
            const taskOrder = order[t];
            const currentOrder = order[currentTask];
            const isCompleted = taskOrder < currentOrder;
            const isCurrent = taskOrder === currentOrder;
            return (
              <div
                key={t}
                className={`${styles.dot} ${isCompleted ? styles.dotDone : ""} ${isCurrent ? styles.dotActive : ""}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
