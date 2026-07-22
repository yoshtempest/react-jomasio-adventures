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
  return asset(`/assets/npcs/${path}`);
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

const STATE_FOLDER: Record<string, string | null> = {
  idle: "idle",
  idleCrounched: "idle",
  attack: "attack",
  crit: "attack",
  preAttack: "attack",
  blockAttack: "attack",
  fallingAttack: "attack",
  jump: "jump",
  preJump: "jump",
  falling: "jump",
  walk: "movement",
  preWalk: "movement",
  run: "movement",
  preRun: "movement",
  dash: "movement",
  walkCrounched: "movement",
  special: "special",
  preSpecial: "special",
  preSpecialInAir: "special",
  specialInAir: "special",
  specialInAirFinish: "special",
  blocked: null,
  stun: null,
  charging: null,
  fallen: null,
};

export function resolveBattleSprite(
  character: string,
  state: string,
): string {
  const folder = STATE_FOLDER[state];
  if (folder === undefined) {
    return playerPath(`/${character}/inFight/${state}.svg`);
  }
  if (folder === null) {
    return playerPath(`/${character}/inFight/${state}.svg`);
  }
  return playerPath(`/${character}/inFight/${folder}/${state}.svg`);
}
