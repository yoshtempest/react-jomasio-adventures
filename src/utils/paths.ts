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

type NpcCategory = "ally" | "enemies" | "pets";

const NPC_CATEGORY: Record<string, NpcCategory> = {
  blackao: "ally",
  brothers: "ally",
  brothers1: "ally",
  brothers2: "ally",
  bruninho: "ally",
  duqueC: "ally",
  jailson: "ally",
  janderson: "ally",
  jeso: "ally",
  juju: "ally",
  kidBengala: "ally",
  leo: "ally",
  mariMarques: "ally",
  peruFather: "ally",
  reincardion: "ally",
  remedinha: "ally",
  solange: "ally",
  surica: "ally",
  system: "ally",
  tiadorim: "ally",
  tim: "ally",
  victor: "ally",
  zeOfBraga: "ally",
  zeOfMilk: "ally",
  ains: "enemies",
  baal: "enemies",
  baiano: "enemies",
  brodiclass: "enemies",
  brodis: "enemies",
  deise: "enemies",
  denis: "enemies",
  dragonKing: "enemies",
  dummy: "enemies",
  elitCrocodile: "enemies",
  figurantOfBaalCult: "enemies",
  figurantOfDragonKingCult: "enemies",
  figurantOfMobyDickCult: "enemies",
  fischer: "enemies",
  hungryCow: "enemies",
  hungryDog: "enemies",
  hungryFish: "enemies",
  hungryPig: "enemies",
  jhowsimar: "enemies",
  madame: "enemies",
  manim: "enemies",
  maugrelo: "enemies",
  maurao: "enemies",
  mobyDick: "enemies",
  muyMacho: "enemies",
  necromancer: "enemies",
  neimito: "enemies",
  planetarySisters: "enemies",
  rice: "enemies",
  slimita: "enemies",
  spiritMotocycler: "enemies",
  srGuaxinim: "enemies",
  technoblade: "enemies",
  trueVandinha: "enemies",
  vandinhaFragment: "enemies",
  yangKai: "enemies",
  piupiu: "pets",
  hungryKing: "pets",
  crocodile: "pets",
  goat: "pets",
  hungryDeath: "pets",
  leviathan: "pets",
  lupita: "pets",
  mosquito: "pets",
  msSpider: "pets",
  rapariga: "pets",
  riquelsonDog: "pets",
  turkey: "pets",
  zecaUrubu: "pets",
};

export function npcPath(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const npcType = cleanPath.split("/")[0];
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

const ATTACK_FOLDER_ALT = new Set(["marcelo", "eduarda"]);

export function resolveBattleSprite(character: string, state: string): string {
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
