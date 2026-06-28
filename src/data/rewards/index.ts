export type RewardDef = {
  id: string;
  label: string;
  getRequirement: (stage: number) => number;
  getReward: (stage: number) => number;
};

export const REWARDS: RewardDef[] = [
  {
    id: "kill_enemies",
    label: "Derrote {req} inimigos",
    getRequirement: (stage) => 100 * (stage + 1),
    getReward: (stage) => 10 * (stage + 1),
  },
  {
    id: "play_time",
    label: "Jogue por {req}h",
    getRequirement: (stage) => 10 * (stage + 1),
    getReward: (stage) => 5 * (stage + 1),
  },
  {
    id: "unlock_chars",
    label: "Desbloqueie {req} personagens",
    getRequirement: (stage) => stage + 3,
    getReward: (stage) => 20 * (stage + 1),
  },
  {
    id: "kill_same_npc",
    label: "Derrote um mesmo NPC {req} vezes",
    getRequirement: (stage) => 10 * (stage + 1),
    getReward: (stage) => 5 * (stage + 1),
  },
  {
    id: "kill_legendary",
    label: "Derrote {req} NPCs lendários",
    getRequirement: (stage) => stage + 1,
    getReward: (stage) => 50 * (stage + 1),
  },
  {
    id: "kill_boss",
    label: "Derrote {req} Boss",
    getRequirement: (stage) => stage + 1,
    getReward: (stage) => 30 * (stage + 1),
  },
  {
    id: "kill_rare",
    label: "Derrote {req} NPCs raros",
    getRequirement: (stage) => 10 * (stage + 1),
    getReward: (stage) => 15 * (stage + 1),
  },
  {
    id: "damage_dealt",
    label: "Cause {req} de dano total",
    getRequirement: (stage) => 5000 * (stage + 1),
    getReward: (stage) => 10 * (stage + 1),
  },
  {
    id: "damage_taken",
    label: "Receba {req} de dano total",
    getRequirement: (stage) => 3000 * (stage + 1),
    getReward: (stage) => 10 * (stage + 1),
  },
  {
    id: "blocks",
    label: "Bloqueie {req} ataques",
    getRequirement: (stage) => 200 * (stage + 1),
    getReward: (stage) => 5 * (stage + 1),
  },
  {
    id: "misses",
    label: "Faça o inimigo errar {req} vezes",
    getRequirement: (stage) => 100 * (stage + 1),
    getReward: (stage) => 5 * (stage + 1),
  },
  {
    id: "equipment_drops",
    label: "Acumule {req} equipamentos dropados",
    getRequirement: (stage) => 50 * (stage + 1),
    getReward: (stage) => 10 * (stage + 1),
  },
  {
    id: "hits_used",
    label: "Use {req} golpes",
    getRequirement: (stage) => 1000 * (stage + 1),
    getReward: (stage) => 5 * (stage + 1),
  },
  {
    id: "specials_used",
    label: "Use {req} especiais",
    getRequirement: (stage) => 100 * (stage + 1),
    getReward: (stage) => 10 * (stage + 1),
  },
  {
    id: "attacks_used",
    label: "Use {req} ataques comuns",
    getRequirement: (stage) => 500 * (stage + 1),
    getReward: (stage) => 5 * (stage + 1),
  },
];
