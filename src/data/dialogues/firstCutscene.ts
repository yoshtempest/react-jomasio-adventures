import { asset } from "@/utils/paths";

const portrait = (name: string) =>
  asset(`/assets/history/cutscenes/firstCutscene/${name}.svg`);

export const firstCutsceneDialogue = [
  {
    src: portrait("cell"),
    name: "???",
    message:
      "Eu sou o perfeito e vou me tornar o prefeito.",
  },
  {
    src: portrait("doflamingo"),
    name: "???",
    message: "Quem vencer a guerra se tornará a justiça hehe",
  },
  {
    src: portrait("sukuna"),
    name: "???",
    message: "Vamo vender tramontina",
  },
  {
    src: portrait("light"),
    name: "???",
    message: "O nome de todo mundo tá como interrogação.. DROGA!",
  },
  {
    src: portrait("aizen"),
    name: "???",
    message:
      "Entendo... bem eu não ligo, só tinha que preencher o formulário aqui, cuide de fazer seu trabalho com perfeição, Adeus.",
  },
  {
    src: portrait("alucard"),
    name: "???",
    message: "..",
  },
  {
    src: portrait("muzan"),
    name: "???",
    message: "..",
  },
  {
    src: portrait("pegasus"),
    name: "???",
    message: "Meu olho pode ver tudo hehe...",
  },
  {
    src: portrait("lula"),
    name: "???",
    message: "Eu não vou enganar o povo!",
  },
  {
    src: portrait("bolsonaro"),
    name: "???",
    message: "É só uma fomezinha, Tá legal?",
  },
  {
    src: portrait("tokuma"),
    name: "???",
    message: "Que saco.",
  },
] satisfies Dialogue[];
