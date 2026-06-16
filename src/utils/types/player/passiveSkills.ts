export type PassiveSkillId = "doubleJump" | "dash";

export type PassiveSkillNode = {
  id: PassiveSkillId;
  name: string;
  description: string;
  icon: string;
  levelRequired: number;
};

export type CharacterSkillTree = {
  characterId: CharacterId;
  skills: PassiveSkillNode[];
};
