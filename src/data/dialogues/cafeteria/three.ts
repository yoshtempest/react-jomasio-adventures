import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const cafeteriaThreeDialogue = defineDialogue([
  { who: "denis", message: "Eu vim em busca do linguição, tu sabe onde tá?", pose: "tranks" },
  ["protagonista", "Sei não moço, posso ir embora?", "ops"],
  ["deise", "Ele acabou de me dar uma surra, mata ele Denis!!!"],
  ["denis", "Cala a boca que eu estou com fome."],
  ["deise", "Mas, mas..."],
  ["denis", "SEM MAS! QUER APANHAR TAMBÉM?"],
  ["deise", "..."],
  ["protagonista", "Posso ir embora?", "ops"],
  ["denis", "NÃO! VOCÊ VAI ME DAR O LINGUIÇÃO!"],
  ["protagonista", "QUE LINGUIÇÃO??", "desperate"],
  ["denis", "E O QUE É ISSO NO MEIO DE SUAS PERNAS?"],
  ["protagonista", "EU VOU EMBORA!", "desperate"],
  ["denis", "EU TRANQUEI A PORTA, SÓ VAI SAIR QUANDO ME DER O LINGUIÇÃO!"],
  ["protagonista", "SEU MANÍACO!", "desperate"],
  ["denis", "E TU DEISE, SEJA DESINTEGRADA, PERDEU NA LUTA CONTRA O PROTAGONISTA"],
  ["deise", "MAS NÃO TEM COMO VENCER O PROTAGONISTA"],
  ["denis", "EXPANSÃO DE DOMÍNIO, FUUGA."],
]);
