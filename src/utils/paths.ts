import { NPC_CATEGORY, STATE_FOLDER } from "@/data/sprites/sprites";

export function asset(path: string) {
  if (path.startsWith("/")) {
    path = path.slice(1);
  }

  return `${import.meta.env.BASE_URL}${path}`;
}

export function resolveAsset(path?: string) {
  if (!path) return "";

  if (path.startsWith("http") || path.startsWith(import.meta.env.BASE_URL)) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${path.slice(1)}`;
  }

  return path;
}

export function cenariosPath(path: string) {
  return asset(`/assets/cenarios/${path}`);
}

export function jomasioPath(path: string) {
  return cenariosPath(`/jomasio/${path}`);
}

export function playerPath(path: string) {
  return asset(`/assets/player/${path}`);
}

export function npcPath(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const npcType = cleanPath.split("/")[0]!;
  const category = NPC_CATEGORY[npcType];
  if (category) {
    return asset(`/assets/npcs/${category}/${cleanPath}`);
  }
  return asset(`/assets/npcs/${cleanPath}`);
}

export function npcPathAlly(path: string) {
  return asset(`/assets/npcs/ally/${path}`);
}

export function npcPathPets(path: string) {
  return asset(`/assets/npcs/pets/${path}`);
}

export function npcPathEnemie(path: string) {
  return asset(`/assets/npcs/enemies/${path}`);
}

export function npcPathProjectile(path: string) {
  return asset(`/assets/npcs/projectiles/${path}`);
}

export function playerProjectilePath(path: string) {
  return asset(`/assets/player/projectiles/${path}`);
}

export function soundEffectPath(path: string) {
  return asset(`/assets/songs/soundEffects/${path}`);
}

export function backgroundAudioPath(path: string) {
  return asset(`/assets/songs/background/${path}`);
}

export function sfx(path: string) {
  return new Audio(soundEffectPath(`/${path}`));
}

const ATTACK_FOLDER_ALT = new Set([
  "marcelo",
  "artur",
  "riquelme",
  "lucaua",
  "levi",
  "lucas",
  "larissa",
  "camilly",
  "mayra",
  "emanuel",
]);

export type MarceloBattleForm = "default" | "vastolordForm";

// Emanuel não tem as pastas de movimento na raiz do `inFight/` (diferente do
// riquelme/marcelo que têm `inFight/idle/`, `inFight/jump/` + `.svg` soltos).
// Tudo que é movimento fica aninhado em `inFight/movement/`:
//   idle  → inFight/movement/idle/idle.svg
//   jump  → inFight/movement/jump/jump.svg
//   run   → inFight/movement/movement/run.svg
// Isso exige um mapeamento por character + estado (o STATE_FOLDER genérico
// retorna "idle"/"jump"/"movement" como pasta raiz do inFight → 404 p/ emanuel).
const CHARACTER_STATE_FOLDER_ALT: Record<
  string,
  Record<string, string>
> = {
  emanuel: {
    idle: "movement/idle",
    idleCrounched: "movement/idle",
    walk: "movement/movement",
    run: "movement/movement",
    preWalk: "movement/movement",
    preRun: "movement/movement",
    jump: "movement/jump",
    preJump: "movement/jump",
    falling: "movement/jump",
  },
  marcelo: {
    // O marcelo NÃO tem pasta de movimento própria na raiz do inFight:
    // as animações de andar/atacar ficam em `inFight/default/${state}.svg`
    // (tratado no branch abaixo via default/), então aqui já cai o override.
  },
};

/**
 * Estados que possuem sprite na pasta `vastolordForm/` do marcelo. Os demais
 * caem na pasta `default/` quando a forma está ativa.
 */
const MARCELO_VASTOLORD_STATES = new Set(["walk", "preRun", "run"]);

export function resolveBattleSprite(
  character: string,
  state: string,
  weapon?: LucasWeapon,
  form?: MarceloBattleForm,
): string {
  if (
    character === "artur" &&
    (state === "preSpecial" || state === "preSpecial2" || state === "special")
  ) {
    return playerPath(`/artur/inFight/special/arturSeeing.svg`);
  }
  if (state === "mostHonored" && character === "riquelme") {
    return playerPath(`/riquelme/inFight/mostHonored.svg`);
  }
  // Genki Dama do emanuel: a fase de subida usa o sprite `falling.svg` (não
  // existe `genkiDamaRising.svg`) — o custo fica na pasta de movimento/jump.
  if (state === "genkiDamaRising" && character === "emanuel") {
    return playerPath(`/emanuel/inFight/movement/jump/falling.svg`);
  }
  const folder = STATE_FOLDER[state];
  if (folder === undefined || folder === null) {
    if (character === "lucas" && weapon) {
      return playerPath(`/${character}/inFight/${weapon}/${state}.svg`);
    }
    if (character === "marcelo") {
      return playerPath(`/${character}/inFight/default/${state}.svg`);
    }
    return playerPath(`/${character}/inFight/${state}.svg`);
  }
  // O emanuel aninha TODO o movimento em `inFight/movement/` (idle/jump/run
  // não ficam na raiz do inFight como no riquelme/marcelo). O override por
  // character + estado resolve isso (ex.: idle → movement/idle).
  const resolved =
    CHARACTER_STATE_FOLDER_ALT[character]?.[state] ??
    (folder === "attack" && ATTACK_FOLDER_ALT.has(character)
      ? "attacks"
      : folder);
  if (character === "lucas" && weapon) {
    return playerPath(
      `/${character}/inFight/${weapon}/${resolved}/${state}.svg`,
    );
  }
  if (character === "marcelo") {
    if (form === "vastolordForm" && MARCELO_VASTOLORD_STATES.has(state)) {
      return playerPath(
        `/${character}/inFight/vastolordForm/movement/${state}.svg`,
      );
    }
    return playerPath(`/${character}/inFight/default/${resolved}/${state}.svg`);
  }
  return playerPath(`/${character}/inFight/${resolved}/${state}.svg`);
}
