export type Task =
  | "moveLeft"
  | "moveRight"
  | "jump"
  | "attack"
  | "block"
  | "done";

export const TASKS: Task[] = [
  "moveLeft",
  "moveRight",
  "jump",
  "attack",
  "block",
  "done",
];

export const TASK_ORDER: Record<Task, number> = {
  moveLeft: 1,
  moveRight: 2,
  jump: 3,
  attack: 4,
  block: 5,
  done: 6,
};

export interface TaskInstruction {
  text: string;
  sub: string;
}

export const TASK_INSTRUCTIONS: Record<Task, TaskInstruction> = {
  moveLeft: {
    text: "Pressione A ou ← para se mover",
    sub: "Ande para a esquerda",
  },
  moveRight: {
    text: "Pressione D ou → para se mover",
    sub: "Ande para a direita",
  },
  jump: {
    text: "Pressione W ou ↑ para pular",
    sub: "Pule",
  },
  attack: {
    text: "Pressione L para atacar",
    sub: "Ataque o boneco de treino",
  },
  block: {
    text: "Pressione S ou ↓ para bloquear",
    sub: "Bloqueie",
  },
  done: {
    text: "Parabéns!",
    sub: "Você está pronto para sua jornada!",
  },
};

export type TaskStatus = "pending" | "active" | "done";

export function getTaskStatus(task: Task, currentTask: Task): TaskStatus {
  const order = TASK_ORDER[task];
  const current = TASK_ORDER[currentTask];
  if (order < current) return "done";
  if (order === current) return "active";
  return "pending";
}
