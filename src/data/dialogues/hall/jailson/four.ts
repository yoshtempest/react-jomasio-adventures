import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const hallJailsonFourDialogue = defineDialogue([
  { who: "jailson", message: "Agora eu tô a fim de relaxar, tu num quer me trazer um suco de laranja não?", soundSrc: "/assets/songs/soundEffects/npc/iWantToRelax.mp3" },
  { who: "protagonista", message: "Como assim caralho?", expression: "rascal", soundSrc: "/assets/songs/soundEffects/player/inWhatSense.mp3" },
  ["jailson", "Relaxar ué"],
  ["protagonista", "Onde tá o suco de laranja?", "crossArms"],
  ["jailson", "Deve estar lá no lugar que você lutou com o Jhow Simar sabe?"],
  ["protagonista", "Como você sabe que eu lutei com ele?", "why"],
  ["jailson", "A curiosidade mata o gato, chega de perguntas, vai lá e me traz o suco de laranja!"],
]);
