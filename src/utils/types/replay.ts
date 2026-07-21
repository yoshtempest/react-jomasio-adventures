export type ReplayFrame = {
  t: number;

  px: number;
  py: number;
  ps: string;
  pd: string;
  pchar: string;
  pdir: string;
  php: number;
  pmaxhp: number;
  pshield: number;

  nx: number;
  ny: number;
  ns: string;
  ndir: string;
  nhp: number;
  nmaxhp: number;
  npcPhase: number;

  del: number;
  hits: number;
  blockGauge: number;
  blockLimit: number;

  cc: number;
  cr: string;
  cprog: number;
  cnext: string | null;

  dmg: { v: number; x: number; y: number; c: boolean; ty: string }[];
  sm: {
    id: string;
    x: number;
    y: number;
    t: string;
    st: string;
    dir: string;
    hp: number;
  }[];

  petx: number | null;
  pety: number | null;
  petst: string | null;
  petdir: string | null;
  petType: string | null;
  petphp: number | null;
  petpmaxhp: number | null;

  comboAction: string | null;
};

export type ReplayData = {
  id: string;
  npcType: string;
  npcLevel: number;
  npcClass: "common" | "rare" | "epic" | "boss" | "legendary";
  playerCharacter: string;
  playerLevel: number;
  background: string;
  date: string;
  duration: number;
  frames: ReplayFrame[];
};

export type PlayerSnap = {
  x: number;
  y: number;
  state: string;
  battleDirection: string;
  character: string;
  direction: string;
  grabbedUntil: number;
};

export type NpcSnap = {
  x: number;
  y: number;
  state: string;
  direction: string;
  jumpLandingX?: number;
};

export type BattleSnap = {
  playerHP: number;
  playerMaxHp: number;
  playerShield: number;
  npcHP: number;
  npcMaxHp: number;
  npcPhase: number;
  delicia: number;
  hitsToSpecial: number;
  blockGauge: number;
  blockLimit: number;
};

export type DamageNum = {
  value: number;
  x: number;
  y: number;
  type: string;
};

export type SummonSnap = {
  id: string;
  x: number;
  y: number;
  npcType: string;
  state: string;
  direction: string;
  hp: number;
};

export type PetSnap = {
  x: number;
  y: number;
  direction: string;
  state: string;
  npcType: string;
  hp: number;
  maxHp: number;
} | null;
