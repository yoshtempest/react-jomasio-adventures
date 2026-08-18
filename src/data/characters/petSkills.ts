export type PetRole = "montaria" | "suporte" | "dano" | "tanker";

export const PET_ROLE_LABELS: Record<PetRole, string> = {
  montaria: "Montaria",
  suporte: "Suporte",
  dano: "Dano",
  tanker: "Tanker",
};

export const PET_SKILL_COOLDOWN_MS = 5000;

export type PetSkillEffect =
  | { kind: "damage"; multiplier: number }
  | { kind: "summon"; npcType: string }
  | { kind: "shield"; amount: number }
  | { kind: "heal"; amount: number };

export type PetAbilityInfo = {
  name: string;
  description: string;
  cooldownMs: number;
};

export type PetSkillDefinition = {
  petId: string;
  name: string;
  role: PetRole;
  npcType: string;
  battleSprite: string;
  passive: PetAbilityInfo;
  skill: PetAbilityInfo;
  skillEffect: PetSkillEffect;
};

const BATTLE_SPRITES = new Set(["hungryKing", "piupiu", "leviathan"]);

function def(
  petId: string,
  name: string,
  npcType: string,
  role: PetRole,
  passive: PetAbilityInfo,
  skill: PetAbilityInfo,
  skillEffect: PetSkillEffect,
): PetSkillDefinition {
  return {
    petId,
    name,
    role,
    npcType,
    battleSprite: BATTLE_SPRITES.has(npcType) ? npcType : "goat",
    passive,
    skill,
    skillEffect,
  };
}

export const PET_SKILLS: Record<string, PetSkillDefinition> = {
  pet_turkey: def(
    "pet_turkey",
    "Peru",
    "turkey",
    "montaria",
    {
      name: "Andarilho",
      description: "Corre mais rápido no modo exploração.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Voo Rasante",
      description: "Montaria não luta em batalha.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "damage", multiplier: 1 },
  ),
  pet_crocodile: def(
    "pet_crocodile",
    "Crocodilo da lacoste",
    "crocodile",
    "tanker",
    {
      name: "Escamas Duras",
      description: "Ataca com escamas resistentes.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Casca Forte",
      description: "Concede um escudo ao jogador.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "shield", amount: 20 },
  ),
  pet_dog: def(
    "pet_dog",
    "Lupita",
    "lupita",
    "dano",
    {
      name: "Mordida Forte",
      description: "Ataca com uma mordida poderosa.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Mordida Fatal",
      description: "Causa dano triplo ao inimigo.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "damage", multiplier: 3 },
  ),
  pet_cat: def(
    "pet_cat",
    "Rapariga",
    "rapariga",
    "suporte",
    {
      name: "Ronronar",
      description: "Ataca com arranhões rápidos.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Bola de Pelo",
      description: "Recupera a vida do jogador.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "heal", amount: 20 },
  ),
  pet_goat: def(
    "pet_goat",
    "Bodão",
    "goat",
    "dano",
    {
      name: "Cabeçada",
      description: "Ataca com uma cabeçada firme.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Investida Bruta",
      description: "Causa dano triplo ao inimigo.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "damage", multiplier: 3 },
  ),
  pet_duque: def(
    "pet_duque",
    "Duque",
    "duque",
    "dano",
    {
      name: "Olhar Julgador",
      description: "Ataca com olhar penetrante.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Latido Perfurante",
      description: "Causa dano triplo ao inimigo.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "damage", multiplier: 3 },
  ),
  pet_leviathan: def(
    "pet_leviathan",
    "Leviathan",
    "leviathan",
    "tanker",
    {
      name: "Armadura Aquática",
      description: "Ataca com golpes d'água.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Muralha de Escamas",
      description: "Concede um escudo ao jogador.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "shield", amount: 25 },
  ),
  pet_hungryDeath: def(
    "pet_hungryDeath",
    "Morto de Fome",
    "hungryDeath",
    "dano",
    {
      name: "Fome Eterna",
      description: "Ataca sem nunca se saciar.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Devora Tudo",
      description: "Causa dano triplo ao inimigo.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "damage", multiplier: 3 },
  ),
  pet_piupiu: def(
    "pet_piupiu",
    "Piupiu",
    "piupiu",
    "tanker",
    {
      name: "Bico de Aço",
      description: "Ataca com bicadas afiadas.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Postura de Bloqueio",
      description: "Concede um escudo ao jogador.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "shield", amount: 20 },
  ),
  pet_vulture: def(
    "pet_vulture",
    "Zeca Urubu",
    "zecaUrubu",
    "dano",
    {
      name: "Voo de Bicada",
      description: "Ataca com bicadas em voo.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Mergulho Abutre",
      description: "Causa dano triplo ao inimigo.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "damage", multiplier: 3 },
  ),
  pet_hungryKing: def(
    "pet_hungryKing",
    "Rei dos Mortos de Fome",
    "hungryKing",
    "suporte",
    {
      name: "Reinado da Fome",
      description: "Ataca com mordidas fantasmagóricas.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Invocar Morto de Fome",
      description: "Invoca um Morto de Fome para lutar ao seu lado.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "summon", npcType: "hungryDeath" },
  ),
  pet_madame: def(
    "pet_madame",
    "Dona Aranha",
    "madame",
    "suporte",
    {
      name: "Teia Envenenada",
      description: "Ataca com fios de teia.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Teia Regeneradora",
      description: "Recupera a vida do jogador.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "heal", amount: 25 },
  ),
  pet_mosquito: def(
    "pet_mosquito",
    "Muriçoca Soca Soca",
    "mosquito",
    "dano",
    {
      name: "Picada Zumbidora",
      description: "Ataca com picadas incômodas.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    {
      name: "Enxame Picante",
      description: "Causa dano triplo ao inimigo.",
      cooldownMs: PET_SKILL_COOLDOWN_MS,
    },
    { kind: "damage", multiplier: 3 },
  ),
};

export function getPetSkillDefinition(
  petId: string,
): PetSkillDefinition | null {
  return PET_SKILLS[petId] ?? null;
}

export function getPetRole(petId: string): PetRole {
  return PET_SKILLS[petId]?.role ?? "dano";
}

export function isBattlePet(petId: string): boolean {
  const role = getPetRole(petId);
  return role !== "montaria";
}
