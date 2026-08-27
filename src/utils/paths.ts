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
  "eduarda",
  "riquelme",
  "lucaua",
  "levi",
  "lucas",
  "larissa",
  "camilly",
  "mayra",
  "artur",
  "samuel",
  "emanuel",
]);

export function resolveBattleSprite(character: string, state: string): string {
  if (
    character === "artur" &&
    (state === "preSpecial" || state === "preSpecial2" || state === "special")
  ) {
    return playerPath(`/artur/inFight/special/arturSeeing.svg`);
  }
  const folder = STATE_FOLDER[state];
  if (folder === undefined || folder === null) {
    return playerPath(`/${character}/inFight/${state}.svg`);
  }
  const resolved =
    folder === "attack" && ATTACK_FOLDER_ALT.has(character)
      ? "attacks"
      : folder;
  return playerPath(`/${character}/inFight/${resolved}/${state}.svg`);
}
