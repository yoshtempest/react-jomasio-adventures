import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const brodiClassDialogue = defineDialogue([
  ["protagonista", "Eae gente, posso me juntar ao grupo de vocês?", "happy"],
  ["laricell", "É, ele foi sequestrado por neimito"],
  ["drika", ".."],
  {
    who: "marshadow",
    message: "Ele já tá grande, deve saber se virar",
    pose: "crossArms",
  },
  ["protagonista", "Gente, e eu aqui? Vão me ignorar mesmo?", "talking"],
  [
    "laricell",
    "Neimito consegue aplicar genjutsus, então Ematron deve estar sendo manipulado por ele..",
  ],
  {
    who: "marshadow",
    message:
      "Se Ematron realmente estiver sendo manipulado, então Neimito é mais forte do que pensamos, não podemos subestimá-lo",
    pose: "crossArms",
  },
  ["drika", "Gente, Cadê o resto do pessoal?"],
  [
    "laricell",
    "Eles estão comprando tempo para nós nesse momento, logo Vandinha pode descobrir que estamos nos reunindo aqui",
  ],
  ["protagonista", "Eu derrotei ela, hehe", "happy"],
  {
    who: "marshadow",
    message:
      "Fraco assim? Deve ter derrotado um fragmento, some daqui que a conversa é de alto nível.",
    pose: "angryFront",
  },
  ["protagonista", "Então tá..", "crossArms"],
  { who: "drika", message: "Fica triste não", pose: "dontBad" },
  ["protagonista", "Posso me juntar ao conselho então?", "crossArms"],
  { who: "laricell", message: "Quem é você mesmo?", pose: "interrogation" },
  ["protagonista", "Protagonista!", "happy"],
  {
    who: "marshadow",
    message:
      "Estavamos precisando de alguém assim, salva o Ematron lá que eu vou desenvolver o jogo enquanto isso",
    pose: "talking",
  },
  ["laricell", "Se salvar ele, eu deixo você se juntar ao conselho"],
  [
    "protagonista",
    "E o que eu ganho ao salvar ele? Sabem que eu não vou trabalhar de graça né?",
    "crossArms",
  ],
  {
    who: "laricell",
    message: "Ganha experiência na vida, então vai lá farmar seu xp vai",
    pose: "crossArms",
  },
  [
    "protagonista",
    "Eu sou o protagonista então por que me tratam tão mal?",
    "hungry",
  ],
  {
    who: "marshadow",
    message:
      "Como dizia meu avô, tem que apanhar para aprender, sem surra, sem aprendizado.",
    pose: "talking",
  },
  ["protagonista", "Tá bom, tô indo", "crossArms"],
]);
