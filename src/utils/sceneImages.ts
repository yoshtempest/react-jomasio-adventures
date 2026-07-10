import { asset } from "@/utils/paths";

type SceneInfo = {
  label: string;
  image: string;
};

const routeSceneMap: Record<string, SceneInfo> = {
  "/firstscreen": { label: "Primeira Tela", image: "/assets/cenarios/firstScreen.svg" },
  "/tutorial": { label: "Tutorial", image: "/assets/cenarios/tutorial.svg" },
  "/combatTutorial": { label: "Tutorial de Combate", image: "/assets/cenarios/tutorial.svg" },
  "/hall": { label: "Hall Jomasio", image: "/assets/cenarios/jomasio/hall/center.svg" },
  "/cantina": { label: "Cantina", image: "/assets/cenarios/cantina.svg" },
  "/library": { label: "Biblioteca", image: "/assets/cenarios/library.svg" },
  "/home": { label: "Tela Inicial", image: "/assets/logo.svg" },
  "/battle": { label: "Batalha", image: "/assets/mainGame.svg" },
  "/technoblade": { label: "Sala Technoblade", image: "/assets/cenarios/technoblade.svg" },
  "/director": { label: "Sala do Diretor", image: "/assets/cenarios/director.svg" },
  "/hell": { label: "Sala do Inferno", image: "/assets/cenarios/hellRoom.svg" },
  "/pcsRoom": { label: "Sala dos PCS", image: "/assets/cenarios/pcsRoom.svg" },
  "/footballCourt": { label: "Quadra", image: "/assets/cenarios/footballCourt.svg" },
  "/brodiClass": { label: "Sala Brodi", image: "/assets/cenarios/brodiClass.svg" },
  "/pandemony": { label: "Pandemônio", image: "/assets/cenarios/pandemonyRoom.svg" },
  "/cafeteria": { label: "Cafeteria", image: "/assets/cenarios/cafeteria.svg" },
  "/professorsRoom": { label: "Sala dos Professores", image: "/assets/cenarios/professorsRoom.svg" },
  "/timButscher": { label: "Tim Butscher", image: "/assets/cenarios/timButscher.svg" },
};

export function getSceneInfo(route: string): SceneInfo {
  const base = "/" + (route.split("/")[1] ?? "");
  const match = routeSceneMap[route] ?? routeSceneMap[base];
  if (match) return match;

  return { label: route, image: "/assets/logo.svg" };
}

export function getSceneImage(route: string): string {
  return asset(getSceneInfo(route).image);
}

export function getSceneLabel(route: string): string {
  return getSceneInfo(route).label;
}
