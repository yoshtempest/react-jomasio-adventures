import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router";
import type { Task, TaskInstruction } from "@/gameRules/tutorial/combatTasks";
import {
  TASK_INSTRUCTIONS,
  getTaskStatus,
  TASKS,
} from "@/gameRules/tutorial/combatTasks";

export function useCombatTasks() {
  const navigate = useNavigate();
  const { player, setMode } = usePlayer();
  const [currentTask, setCurrentTask] = useState<Task>("moveLeft");
  const initialX = useRef<number | null>(null);
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    if (initialX.current === null) {
      initialX.current = player.x;
    }
  });

  useEffect(() => {
    if (currentTask !== "moveLeft") return;
    if (player.x <= initialX.current! - 10) setCurrentTask("moveRight");
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
    if (player.state === "preAttack" || player.state === "attack")
      setCurrentTask("block");
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

  const instruction: TaskInstruction = TASK_INSTRUCTIONS[currentTask];

  return {
    currentTask,
    instruction,
    TASKS,
    getTaskStatus: (task: Task) => getTaskStatus(task, currentTask),
  };
}
