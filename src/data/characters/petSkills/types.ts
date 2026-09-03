export type PetRole = "montaria" | "suporte" | "dano" | "tanker";

export type PetSkillEffect =
  | { kind: "damage"; multiplier: number }
  | { kind: "jumpAttack"; multiplier: number }
  | {
      kind: "teleportBite";
      multiplier: number;
      bleedMs: number;
    }
  | { kind: "summon"; npcType: string }
  | { kind: "shield"; amount: number }
  | { kind: "heal"; amount: number }
  | { kind: "healPercent"; perStar: number[] };

export type PetPassiveEffect = { kind: "oneHitShield"; cooldownMs: number };

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
  passiveEffect?: PetPassiveEffect;
  skill: PetAbilityInfo;
  skillEffect: PetSkillEffect;
};
