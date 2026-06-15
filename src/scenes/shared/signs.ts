import type { SceneTile, SceneSign } from "@/utils/types/maps/sceneConfig";

const DIRS = [
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
];

function findAdjacentFloor(map: number[][], x: number, y: number): { x: number; y: number } | null {
  for (const { dx, dy } of DIRS) {
    const ax = x + dx;
    const ay = y + dy;
    if (ay >= 0 && ay < map.length && ax >= 0 && ax < map[0].length && map[ay][ax] === 0) {
      return { x: ax, y: ay };
    }
  }
  return null;
}

export const SCENE_NAMES: Record<string, string> = {
  "hall/one": "Hall de Entrada",
  "hall/hell": "Corredor Escuro",
  "hall/pandemony": "Pandemônio",
  "hall/center-one": "Hall Centro",
  "hall/center-two": "Hall Centro - Bloco 2",
  "hall/center-front": "Hall - Entrada do Centro",
  "hall/jailson-one": "Sala do Jailson",
  "hall/jailson-two": "Sala do Jailson - Fundos",
  "hall/left-one": "Hall Esquerdo",
  "hall/afterpcroom-one": "Hall - Saída do PC Room",
  "hall/thirdclass": "Terceira Sala",

  "pcroom/one": "Sala de PC - 1",
  "pcroom/two": "Sala de PC - 2",
  "pcroom/three": "Sala de PC - 3",
  "pcroom/four": "Sala de PC - 4",
  "pcroom/five": "Sala de PC - 5",
  "pcroom/six": "Sala de PC - 6",
  "pcroom/seven": "Sala de PC - 7",

  "cantina/one": "Cantina",
  "cantina/two": "Cantina - Fundos",

  "cafeteria/one": "Refeitório",
  "cafeteria/two": "Refeitório - Bloco 2",
  "cafeteria/three": "Refeitório - Bloco 3",
  "cafeteria/four": "Refeitório - Bloco 4",

  "library/one": "Biblioteca",
  "library/two": "Biblioteca - Acervo",
  "library/secret-passage": "Passagem Secreta",

  "director/one": "Diretoria",
  "director/two": "Diretoria - Sala do Diretor",

  "footballcourt/one": "Quadra de Futebol",
  "footballcourt/two": "Quadra - Vestuários",

  "hellroom/one": "Sala do Inferno",
  "hellroom/two": "Sala do Inferno - Câmara",
  "hellroom/three": "Sala do Inferno - Masmorra",
};

export const ROUTE_LABELS: Record<string, string> = {
  "/hall/one": "Hall de Entrada",
  "/hall/hell": "Corredor Escuro",
  "/hall/pandemony": "Pandemônio",
  "/hall/center-one": "Hall Centro",
  "/hall/center-two": "Hall Centro",
  "/hall/center-front": "Hall Centro",
  "/hall/jailson-one": "Sala do Jailson",
  "/hall/jailson-two": "Sala do Jailson",
  "/hall/left-one": "Hall Esquerdo",
  "/hall/afterpcroom-one": "Hall - Saída do PC",
  "/hall/thirdclass": "Terceira Sala",

  "/pcroom/one": "Sala de PC 1",
  "/pcroom/two": "Sala de PC 2",
  "/pcroom/three": "Sala de PC 3",
  "/pcroom/four": "Sala de PC 4",
  "/pcroom/five": "Sala de PC 5",
  "/pcroom/six": "Sala de PC 6",
  "/pcroom/seven": "Sala de PC 7",

  "/cantina/one": "Cantina",
  "/cantina/two": "Cantina - Fundos",

  "/cafeteria/one": "Refeitório",
  "/cafeteria/two": "Refeitório",
  "/cafeteria/three": "Refeitório",
  "/cafeteria/four": "Refeitório",
  "/director/one": "Diretoria",
  "/director/two": "Diretoria",
  "/footballcourt/one": "Quadra",
  "/footballcourt/two": "Quadra - Vestuários",

  "/library/one": "Biblioteca",
  "/library/two": "Biblioteca",
  "/library/secret-passage": "Passagem Secreta",

  "/hellroom/one": "Sala do Inferno",
  "/hellroom/two": "Sala do Inferno",
  "/hellroom/three": "Sala do Inferno",
};

export function getSceneName(pathname: string): string {
  const key = pathname.replace(/^\//, "");
  return SCENE_NAMES[key] ?? key;
}

export function autoSigns(
  tiles: SceneTile[],
  map: number[][],
  sceneName: string,
): SceneSign[] {
  const signs: SceneSign[] = [];

  for (const tile of tiles) {
    if (!tile.route) continue;

    const pos = findAdjacentFloor(map, tile.x, tile.y);
    if (!pos) continue;

    const destName = ROUTE_LABELS[tile.route] ?? tile.route.split("/").filter(Boolean).pop() ?? tile.route;
    const message = `📍 ${sceneName}\n➡️ ${destName}`;

    signs.push({ x: pos.x, y: pos.y, message });
  }

  return signs;
}
