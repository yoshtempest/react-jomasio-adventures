export type MonthlyMissionDef = {
  id: string;
  label: string;
  requirement: number;
  reward: number;
};

export const MONTHLY_MISSIONS: MonthlyMissionDef[] = [
  {
    id: "kill_enemies",
    label: "Derrote {req} inimigos",
    requirement: 500,
    reward: 30,
  },
  {
    id: "play_time",
    label: "Jogue por {req}h",
    requirement: 30,
    reward: 25,
  },
  {
    id: "kill_boss",
    label: "Derrote {req} Boss",
    requirement: 10,
    reward: 50,
  },
  {
    id: "kill_legendary",
    label: "Derrote {req} NPCs lendários",
    requirement: 5,
    reward: 80,
  },
  {
    id: "damage_dealt",
    label: "Cause {req} de dano",
    requirement: 100000,
    reward: 35,
  },
  {
    id: "blocks",
    label: "Bloqueie {req} ataques",
    requirement: 1000,
    reward: 20,
  },
  {
    id: "login_days",
    label: "Entre no jogo por {req} dias",
    requirement: 20,
    reward: 40,
  },
];
