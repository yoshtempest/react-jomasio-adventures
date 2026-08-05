import type { NavbarOption } from "@/utils/types/player/navbar";

export const NAVBAR_OPTIONS: NavbarOption[] = [
  { icon: "/assets/navbar/player.svg", label: "Jogador", screen: "player" },
  {
    icon: "/assets/navbar/character.svg",
    label: "Personagem",
    screen: "character",
  },
  { icon: "/assets/navbar/status.svg", label: "Status", screen: "status" },
  {
    icon: "/assets/navbar/equipments.svg",
    label: "Equipamentos",
    screen: "equipment",
  },
  {
    icon: "/assets/navbar/backpack.svg",
    label: "Mochila",
    screen: "inventory",
  },
  { icon: "/assets/navbar/quests.svg", label: "Missões", screen: "missions" },
  {
    icon: "/assets/navbar/deliciaDex.svg",
    label: "DelíciaDex",
    screen: "bestiary",
  },
  {
    icon: "/assets/navbar/professions.svg",
    label: "Profissões",
    screen: "professions",
  },
  { icon: "/assets/navbar/titles.svg", label: "Títulos", screen: "titles" },
  { icon: "/assets/equipments/pets.svg", label: "Pets", screen: "pets" },
  { icon: "/assets/navbar/saves.svg", label: "Saves", screen: "saves" },
  {
    icon: "/assets/navbar/configs.svg",
    label: "Configurações",
    screen: "config",
  },
];
