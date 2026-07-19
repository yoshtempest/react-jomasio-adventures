import { asset, jomasioPath, playerPath, npcPath } from "@/utils/paths";

export const locations = [
  { name: "Hall", image: jomasioPath("/hall/one.svg") },
  { name: "Cantina", image: jomasioPath("/cantina.svg") },
  { name: "Biblioteca", image: jomasioPath("/library/default.svg") },
  { name: "Sala dos PCs", image: jomasioPath("/pcsRoom.svg") },
  { name: "Quadra", image: jomasioPath("/footballCourt.svg") },
  { name: "Cafeteria", image: jomasioPath("/cafeteria.svg") },
];

export const bosses = [
  {
    name: "Jailson",
    image: npcPath("/jailson/default.svg"),
    desc: "O rei da delícia",
  },
  {
    name: "Irmãs Planetárias",
    image: npcPath("/planetarySisters/mary.svg"),
    desc: "Guardiãs do centro",
  },
  {
    name: "Maurão",
    image: npcPath("/maurao/default.svg"),
    desc: "A fera do pandemônio",
  },
  {
    name: "Vandinha",
    image: npcPath("/vandinhaFragment/default.svg"),
    desc: "Fragmento sombrio",
  },
  {
    name: "JhowSimar",
    image: npcPath("/jhowsimar/default.svg"),
    desc: "O lendário porteiro",
  },
  {
    name: "Hungry King",
    image: npcPath("/hungryKing/default.svg"),
    desc: "Rei da fome",
  },
  {
    name: "Juan Derson",
    image: npcPath("/janderson/right.svg"),
    desc: "Professor do café",
  },
  {
    name: "Bode",
    image: npcPath("/goat/default.svg"),
    desc: "Cardápio principal",
  },
];

export const characters = [
  {
    name: "Marcelo",
    image: playerPath("/marcelo/default.svg"),
    class: "Espadachim",
  },
  {
    name: "Artur",
    image: playerPath("/artur/default.svg"),
    class: "Explosivo",
  },
  {
    name: "Eduarda",
    image: playerPath("/eduarda/default.svg"),
    class: "Inquisidora",
  },
  {
    name: "Riquelme",
    image: playerPath("/riquelme/default.svg"),
    class: "Tanque",
  },
  {
    name: "Emanuel",
    image: playerPath("/emanuel/default.svg"),
    class: "Atacante",
  },
  { name: "Lucas", image: playerPath("/lucas/default.svg"), class: "Boxeador" },
  {
    name: "Lucauã",
    image: playerPath("/lucaua/default.svg"),
    class: "Versátil",
  },
  {
    name: "Larissa",
    image: playerPath("/larissa/default.svg"),
    class: "Atiradora",
  },
  {
    name: "Camilly",
    image: playerPath("/camilly/default.svg"),
    class: "Lutadora",
  },
  {
    name: "Samuel",
    image: playerPath("/samuel/default.svg"),
    class: "Berserker",
  },
  { name: "Mayra", image: playerPath("/mayra/default.svg"), class: "DPS" },
];

export const funnyMoments = [
  {
    title: "O Peru",
    desc: "Tu num é nem gente Peru! Glu Glu Glu Glu Glu",
    image: asset("/assets/items/peru.svg"),
  },
  {
    title: "Deliciômetro",
    desc: "Meça o nível de delícia da sua gameplay com este medidor sagrado.",
    image: asset("/assets/deliciometro.svg"),
  },
  {
    title: "Morto de Fome",
    desc: "É duas fungada e a comida se acaba, é duas pedalada e a corrente cai.",
    image: npcPath("/hungryDeath/face.svg"),
  },
  {
    title: "Leite Suspeito",
    desc: "Achou um leite na cantina? Melhor pensar duas vezes antes de beber.",
    image: asset("/assets/items/suspect_milk.svg"),
  },
];
