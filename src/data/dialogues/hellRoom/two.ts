import { npcPath } from "@/utils/paths";

export const HellRoomTwoDialogue = [
  {
    src: npcPath("/peruFather/right.svg"),
    name: "Homem desconhecido",
    message:
      "Ele pode ser um pouco duro às vezes, mas cuide bem dele por favor",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Mas que baita piruzão em",
    expression: "rascal",
  },
] satisfies Dialogue[];
