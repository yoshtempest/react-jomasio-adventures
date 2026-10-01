import type { Race } from "@/utils/types/character/race";
import type { ElementType } from "@/utils/types/battle/element";

type RaceMeta = {
  /** Afinidade/tipagem principal herdada da raça. */
  element: ElementType;
  /** Breve descrição da raça. */
  description: string;
};

/** Metadados descritivos por raça. */
export const RACE_META: Record<Race, RaceMeta> = {
  Human: {
    element: "Normalis",
    description:
      "Versáteis e de notável capacidade de mestiçagem, podem despertar qualquer tipagem com o tempo.",
  },
  Draconian: {
    element: "Draco",
    description:
      "Linhagem de dracos. Do Dragão Glacial ao Draconiano Ígneo, cruzam bem com quase toda raça.",
  },
  Maritime: {
    element: "Aquos",
    description:
      "Habitantes dos mares: tritões, sereianos, homens-peixe e serpentes marinhas.",
  },
  Ignian: {
    element: "Pyrus",
    description: "Seu corpo naturalmente produz e conduz calor intenso.",
  },
  Terran: {
    element: "Subterra",
    description:
      "Homens-toupeira, gigantes de pedra, golemides, anões e criaturas subterrâneas.",
  },
  Aerial: {
    element: "Ventus",
    description:
      "Seres ligados ao vento: humanos alados, harpias e espíritos do vento.",
  },
  Glacial: {
    element: "Cryo",
    description:
      "Nascidos em regiões congeladas, resistem ao frio e dominam o gelo.",
  },
  Raykou: {
    element: "Electricus",
    description:
      "Conduzem eletricidade pelo corpo, podendo formar criaturas quase biomecânicas.",
  },
  Luminar: {
    element: "Haos",
    description:
      "Raça associada à luz. Do anjo ao celestial, terminam em semideuses.",
  },
  Ferrian: {
    element: "Metallum",
    description:
      "Pele metálica, ossos de metal e sangue semelhante a mercúrio.",
  },
  Silvan: {
    element: "Natura",
    description:
      "Da floresta: elfos, entes, druidas, homens-planta e espíritos da mata.",
  },
  Psychic: {
    element: "Psychicus",
    description: "Telepatia, telecinese, manipulação mental e precognição.",
  },
  Nimian: {
    element: "Nympha",
    description:
      "Ninfas, fadas, espíritos e dryads — seres etéreos ligados à magia.",
  },
  Obscurian: {
    element: "Darkus",
    description: "Manipula sombras e tudo o que esconde a luz.",
  },
  Phantom: {
    element: "Umbra",
    description:
      "Diferente dos Obscurianos: manipula o vazio e as trevas absolutas.",
  },
};