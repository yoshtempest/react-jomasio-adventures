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
  pettype: string | null;
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
  background: string;
  date: string;
  duration: number;
  frames: ReplayFrame[];
};
