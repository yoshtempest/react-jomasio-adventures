export type Task =
  | "moveLeft"
  | "moveRight"
  | "jump"
  | "attack"
  | "special"
  | "crounch"
  | "block"
  | "done";

export const TASKS: Task[] = [
  "moveLeft",
  "moveRight",
  "jump",
  "attack",
  "special",
  "crounch",
  "block",
  "done",
];

export const TASK_ORDER: Record<Task, number> = {
  moveLeft: 1,
  moveRight: 2,
  jump: 3,
  attack: 4,
  special: 5,
  crounch: 6,
  block: 7,
  done: 8,
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
  special: {
    text: "Pressione G para utilizar o ataque especial quando o deliciomêtro estiver carregado",
    sub: "Utilize o especial",
  },
  crounch: {
    text: "Pressione S ou ↓ para agachar e desviar de projéteis",
    sub: "Agache",
  },
  block: {
    text: "Pressione B para bloquear ataques",
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
