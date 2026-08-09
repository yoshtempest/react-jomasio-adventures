import { npcPath } from "@/utils/paths";

export const hallJailsonFourDialogue = [
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message:
      "Agora eu tô a fim de relaxar, tu num quer me trazer um suco de laranja não?",
    soundSrc: "/assets/songs/soundEffects/npc/iWantToRelax.mp3",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Como assim caralho?",
    soundSrc: "/assets/songs/soundEffects/player/inWhatSense.mp3",
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Relaxar ué",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Onde tá o suco de laranja?",
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Deve estar lá no lugar que você lutou com o Jhow Simar sabe?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Como você sabe que eu lutei com ele?",
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message:
      "A curiosidade mata o gato, chega de perguntas, vai lá e me traz o suco de laranja!",
  },
];
