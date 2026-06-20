import { asset } from "@/utils/asset";

export const locations = [
  { name: "Hall", image: asset("/assets/cenarios/jomasio/hall/one.svg") },
  { name: "Cantina", image: asset("/assets/cenarios/cantina.svg") },
  { name: "Biblioteca", image: asset("/assets/cenarios/library.svg") },
  { name: "Sala dos PCs", image: asset("/assets/cenarios/pcsRoom.svg") },
  { name: "Quadra", image: asset("/assets/cenarios/footballCourt.svg") },
  { name: "Cafeteria", image: asset("/assets/cenarios/cafeteria.svg") },
];

export const bosses = [
  { name: "Jailson", image: asset("/assets/npcs/jailson/default.svg"), desc: "O rei da delícia" },
  { name: "Irmãs Planetárias", image: asset("/assets/npcs/planetarySisters/mary.svg"), desc: "Guardiãs do centro" },
  { name: "Maurão", image: asset("/assets/npcs/maurao/default.svg"), desc: "A fera do pandemônio" },
  { name: "Vandinha", image: asset("/assets/npcs/vandinhaFragment/default.svg"), desc: "Fragmento sombrio" },
  { name: "JhowSimar", image: asset("/assets/npcs/jhowsimar/default.svg"), desc: "O lendário porteiro" },
  { name: "Hungry King", image: asset("/assets/npcs/hungryKing/default.svg"), desc: "Rei da fome" },
  { name: "Juan Derson", image: asset("/assets/npcs/janderson/right.svg"), desc: "Professor do café" },
  { name: "Bode", image: asset("/assets/npcs/goat/default.svg"), desc: "Cardápio principal" },
];

export const characters = [
  { name: "Marcelo", image: asset("/assets/player/marcelo/default.svg"), class: "Espadachim" },
  { name: "Artur", image: asset("/assets/player/artur/default.svg"), class: "Explosivo" },
  { name: "Eduarda", image: asset("/assets/player/eduarda/default.svg"), class: "Inquisidora" },
  { name: "Riquelme", image: asset("/assets/player/riquelme/default.svg"), class: "Tanque" },
  { name: "Emanuel", image: asset("/assets/player/emanuel/default.svg"), class: "Atacante" },
  { name: "Lucas", image: asset("/assets/player/lucas/default.svg"), class: "Boxeador" },
  { name: "Lucauã", image: asset("/assets/player/lucaua/default.svg"), class: "Versátil" },
  { name: "Larissa", image: asset("/assets/player/larissa/default.svg"), class: "Atiradora" },
  { name: "Camilly", image: asset("/assets/player/camilly/default.svg"), class: "Lutadora" },
  { name: "Samuel", image: asset("/assets/player/samuel/default.svg"), class: "Berserker" },
  { name: "Mayra", image: asset("/assets/player/mayra/default.svg"), class: "DPS" },
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
    image: asset("/assets/npcs/hungryDeath/face.svg"),
  },
  {
    title: "Leite Suspeito",
    desc: "Achou um leite na cantina? Melhor pensar duas vezes antes de beber.",
    image: asset("/assets/items/suspect_milk.svg"),
  },
];
