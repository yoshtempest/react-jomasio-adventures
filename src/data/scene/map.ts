import { sceneBackgrounds } from "./background";

export type MapCell = {
  routes: string[];
  image: string;
  label: string;
};

export const SCENE_MAP: (MapCell | null)[][] = [
  [
    {
      routes: ["/library"],
      image: sceneBackgrounds.Library,
      label: "Biblioteca",
    },
    {
      routes: ["/hall/thirdclass"],
      image: sceneBackgrounds.HallThirdClass,
      label: "Third Class",
    },
    {
      routes: ["/brodiclass"],
      image: sceneBackgrounds.BrodiClass,
      label: "Conselho dos Brodi",
    },
  ],
  [
    {
      routes: ["/hall/center-front"],
      image: sceneBackgrounds.HallCenterFront,
      label: "Corredor Norte",
    },
    {
      routes: ["/hall/jailson-one", "/hall/jailson-two"],
      image: sceneBackgrounds.HallJailson,
      label: "Corredor Direita",
    },
  ],
  [
    {
      routes: ["/cantina"],
      image: sceneBackgrounds.Cantina,
      label: "Refeitorio",
    },
    {
      routes: ["/hall/center-one", "/hall/center-two"],
      image: sceneBackgrounds.HallCenter,
      label: "Corredor Central",
    },
    {
      routes: ["/hall/hell"],
      image: sceneBackgrounds.HallHell,
      label: "Perigo",
    },
    {
      routes: ["/footballcourt"],
      image: sceneBackgrounds.FootballCourt,
      label: "Quadra",
    },
  ],
  [
    {
      routes: ["/cafeteria"],
      image: sceneBackgrounds.Cafeteria,
      label: "Cantina",
    },
    {
      routes: ["/hall/left-one"],
      image: sceneBackgrounds.HallLeft,
      label: "Corredor Esquerda",
    },
      {
      routes: ["/hall/one", "/hall/afterpcroom-one"],
      image: sceneBackgrounds.HallOne,
      label: "Corredor Um",
    },
    {
      routes: ["/director"],
      image: sceneBackgrounds.Director,
      label: "Diretoria",
    },
    {
      routes: ["/hellroom"],
      image: sceneBackgrounds.HellRoom,
      label: "Segundo B",
    },
  ],
  [
    {
      routes: ["/pcroom"],
      image: sceneBackgrounds.PcsRoom,
      label: "Sala dos PCs",
    },
    {
      routes: ["/hall/pandemony"],
      image: sceneBackgrounds.HallPandemony,
      label: "Pandemônio",
    },
  ],
];