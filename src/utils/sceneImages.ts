import { jomasioPath, resolveAsset } from "@/utils/paths";

type SceneInfo = {
  label: string;
  image: string;
};

const routeSceneMap: Record<string, SceneInfo> = {
  "/jomasioEntrance": {
    label: "Entrada do Jomásio",
    image: jomasioPath("/jomasioEntrance.svg"),
  },
  "/tutorial": {
    label: "Tutorial",
    image: jomasioPath("/tutorial.svg"),
  },
  "/combatTutorial": {
    label: "Tutorial de Combate",
    image: jomasioPath("/tutorial.svg"),
  },
  "/hall": {
    label: "Hall Jomasio",
    image: jomasioPath("/hall/center.svg"),
  },
  "/cantina": {
    label: "Cantina",
    image: jomasioPath("/cantina.svg"),
  },
  "/library": {
    label: "Biblioteca",
    image: jomasioPath("/library/default.svg"),
  },
  "/home": { label: "Tela Inicial", image: "/assets/logo.svg" },
  "/battle": { label: "Batalha", image: "/assets/mainGame.svg" },
  "/technoblade": {
    label: "Sala Technoblade",
    image: "/assets/cenarios/technoblade.svg",
  },
  "/director": {
    label: "Sala do Diretor",
    image: jomasioPath("/director.svg"),
  },
  "/hell": {
    label: "Sala do Inferno",
    image: jomasioPath("/hellRoom.svg"),
  },
  "/pcsRoom": {
    label: "Sala dos PCS",
    image: jomasioPath("/pcsRoom.svg"),
  },
  "/footballCourt": {
    label: "Quadra",
    image: jomasioPath("/footballCourt.svg"),
  },
  "/brodiClass": {
    label: "Sala Brodi",
    image: jomasioPath("/brodiClass.svg"),
  },
  "/pandemony": {
    label: "Pandemônio",
    image: jomasioPath("/pandemonyRoom.svg"),
  },
  "/cafeteria": {
    label: "Cafeteria",
    image: jomasioPath("/cafeteria.svg"),
  },
  "/professorsRoom": {
    label: "Sala dos Professores",
    image: jomasioPath("/professorsRoom.svg"),
  },
  "/timButscher": {
    label: "Tim Butscher",
    image: jomasioPath("/timButscher.svg"),
  },
};

export function getSceneInfo(route: string): SceneInfo {
  const base = "/" + (route.split("/")[1] ?? "");
  const match = routeSceneMap[route] ?? routeSceneMap[base];
  if (match) return match;

  return { label: route, image: "/assets/logo.svg" };
}

export function getSceneImage(route: string): string {
  return resolveAsset(getSceneInfo(route).image);
}

export function getSceneLabel(route: string): string {
  return getSceneInfo(route).label;
}
