import { playerPath } from "@/utils/paths";

export const brodiClassTwoDialogue = [
    {
        src: playerPath("/eduarda/talking.svg"),
        name: "Drika",
        message: "Boa sorte em salvar Ematron",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "Mas onde ele está?",
    },
    {
        src: playerPath("/marcelo/crossArms.svg"),
        name: "Marshadow",
        message: "Lá na quadra",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "E como que eu vou chegar lá?",
    },
    {
        src: playerPath("/marcelo/angry.svg"),
        name: "Marshadow",
        message: "Se vira",
    },
] satisfies Dialogue[];
