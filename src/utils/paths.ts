import { NPC_CATEGORY, STATE_FOLDER } from "@/data/sprites/sprites";
import { isSpecialTrigger, stateData } from "@/gameRules/battle/playerStates";

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

/* -------------------------------------------------------------------------- */
/* Categorias de asset                                                         */
/* -------------------------------------------------------------------------- */

/*
 * Constantes e dados do jogo guardam só o NOME do arquivo
 * (`"miner.svg"`); a pasta mora aqui. Antes cada call site repetia a string
 * "/assets/algumaPasta/" na mão, o que quebrava em silêncio quando a pasta
 * mudava. Invariante: se o dado já chamou uma função daqui, o consumidor
 * usa o valor direto — nunca `asset()` em cima, que prefixaria o BASE_URL
 * duas vezes.
 */

export function rootAssetPath(name: string): string {
  return asset(`/assets/${name}`);
}

export function itemPath(name: string): string {
  return asset(`/assets/items/${name}`);
}

export function itemFilterPath(name: string): string {
  return asset(`/assets/items/filter/${name}`);
}

export function chestPath(name: string): string {
  return asset(`/assets/items/chests/${name}`);
}

export function keyPath(name: string): string {
  return asset(`/assets/items/keys/${name}`);
}

export function coinPath(name: string): string {
  return asset(`/assets/items/coins/${name}`);
}

export function xpPotionPath(name: string): string {
  return asset(`/assets/items/xpPotion/${name}`);
}

export function manaPotionPath(name: string): string {
  return asset(`/assets/items/manaPotion/${name}`);
}

export function lootBagPath(name: string): string {
  return asset(`/assets/items/lootBag/${name}`);
}

export function titleBadgePath(name: string): string {
  return asset(`/assets/badges/titles/${name}`);
}

export function elementBadgePath(name: string): string {
  return asset(`/assets/badges/elements/${name}`);
}

export function professionBadgePath(name: string): string {
  return asset(`/assets/badges/professions/${name}`);
}

export function rankBadgePath(name: string): string {
  return asset(`/assets/badges/ranks/${name}`);
}

export function statusIconPath(name: string): string {
  return asset(`/assets/status/${name}`);
}

export function navbarIconPath(name: string): string {
  return asset(`/assets/navbar/${name}`);
}

export function equipmentIconPath(name: string): string {
  return asset(`/assets/equipments/${name}`);
}

export function questIconPath(name: string): string {
  return asset(`/assets/quests/${name}`);
}

export function platePath(name: string): string {
  return asset(`/assets/plates/${name}`);
}

export function videoPath(name: string): string {
  return asset(`/assets/videos/${name}`);
}

export function mapAssetPath(name: string): string {
  return asset(`/assets/map/${name}`);
}

export function historyPath(name: string): string {
  return asset(`/assets/history/${name}`);
}

export function cutscenePath(name: string): string {
  return asset(`/assets/history/cutscenes/${name}`);
}

export function transitionPath(name: string): string {
  return asset(`/assets/songs/transitions/${name}`);
}

export function cenariosPath(path: string) {
  return asset(`/assets/cenarios/${path}`);
}

export function jomasioPath(path: string) {
  return cenariosPath(`/jomasio/${path}`);
}

export function itemsPath(path: string) {
  return asset(`/assets/items/${path}`);
}

export function playerPath(path: string) {
  return asset(`/assets/player/${path}`);
}

export function playerPathMarshadowHabilities(path: string) {
  return asset(`/assets/player/marcelo/inFight/default/habilities/${path}`);
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

/** Efeitos visuais compartilhados (usados por qualquer personagem/NPC). */
export function effectsPath(path: string) {
  return asset(`/assets/effects/${path}`);
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
  Partial<Record<PlayerState, string>>
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
 * Sprites da Forma Vastolord do marcelo: depois que a transformação começa, o
 * personagem SÓ pode usar sprites de `vastolordForm/` até o fim da batalha.
 * Os estados que não têm sprite dedicado no folder caem no `idle` da forma.
 */
const MARCELO_VASTOLORD_SPRITES: Partial<Record<PlayerState, string>> = {
  idle: "idle/idle",
  idleCrounched: "idle/idle",
  walk: "movement/walk",
  preWalk: "movement/walk",
  preRun: "movement/preRun",
  run: "movement/run",
  dash: "movement/run",
  preAttack: "attacks/attack",
  attack: "attacks/attack",
  crit: "attacks/attack",
  blockAttack: "attacks/attack",
  kick: "attacks/attack",
  preKick: "attacks/attack",
  punch: "attacks/attack",
  hook: "attacks/attack",
  lowKick: "attacks/attack",
  airGrab: "attacks/attack",
  airKick: "attacks/attack",
  fallingAttack: "attacks/fallingAttack",
  /** Habilidade Laser da Forma Vastolord: segura o sprite de disparo por 3s. */
  laser: "attacks/laser",
};

/**
 * "I Am Atomic": os arquivos da sequência são `preparing.svg` /
 * `finalizating.svg`, em `habilities/atomic/`.
 */
const ATOMIC_SPRITES: Partial<Record<PlayerAtomicState, string>> = {
  preparingAtomic: "preparing",
  finalizatingAtomic: "finalizating",
};

/** Expansão de Domínio: `habilities/domainExpansion/`. */
const DOMAIN_EXPANSION_SPRITES: Partial<
  Record<PlayerDomainExpansionState, string>
> = {
  preMugetsu: "preMugetsu",
  mugetsu: "mugetsu",
};

export function resolveBattleSprite(
  character: string,
  state: PlayerState,
  weapon?: LucasWeapon,
  form?: MarceloBattleForm,
): string {
  if (character === "artur" && isSpecialTrigger(state)) {
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
  // Habilidades do marcelo: os sprites da sequência ficam em pastas próprias
  // (`habilities/atomic/`, `habilities/domainExpansion/`) — não existe
  // `default/preparingAtomic.svg` nem `default/preMugetsu.svg`.
  if (character === "marcelo") {
    const atomicSprite = stateData(ATOMIC_SPRITES, state);
    if (atomicSprite) {
      return playerPathMarshadowHabilities(`/atomic/${atomicSprite}.svg`);
    }
    const domainSprite = stateData(DOMAIN_EXPANSION_SPRITES, state);
    if (domainSprite) {
      return playerPathMarshadowHabilities(
        `/domainExpansion/${domainSprite}.svg`,
      );
    }
  }
  // Forma Vastolord do marcelo: a partir da transformação, TODOS os sprites
  // vêm da pasta `vastolordForm/` — nenhum estado volta ao `default/`.
  if (character === "marcelo" && form === "vastolordForm") {
    const sprite = stateData(MARCELO_VASTOLORD_SPRITES, state) ?? "idle/idle";
    return playerPath(`/marcelo/inFight/vastolordForm/${sprite}.svg`);
  }
  const folder = stateData(STATE_FOLDER, state);
  if (folder === null) {
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
    stateData(CHARACTER_STATE_FOLDER_ALT[character], state) ??
    (folder === "attack" && ATTACK_FOLDER_ALT.has(character)
      ? "attacks"
      : folder);
  if (character === "lucas" && weapon) {
    return playerPath(
      `/${character}/inFight/${weapon}/${resolved}/${state}.svg`,
    );
  }
  if (character === "marcelo") {
    return playerPath(`/${character}/inFight/default/${resolved}/${state}.svg`);
  }
  return playerPath(`/${character}/inFight/${resolved}/${state}.svg`);
}
