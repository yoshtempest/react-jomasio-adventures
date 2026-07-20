export type ReplayFrame = {
  t: number;
  px: number;
  py: number;
  ps: string;
  pd: string;
  nx: number;
  ny: number;
  ns: string;
  php: number;
  pmaxhp: number;
  nhp: number;
  nmaxhp: number;
  del: number;
  hits: number;
  cc: number;
  cr: string;
  dmg: { v: number; x: number; y: number; c: boolean }[];
  sm: { x: number; y: number; t: string; hp: number }[];
};

export type ReplayData = {
  id: string;
  npcType: string;
  npcLevel: number;
  npcClass: "common" | "rare" | "epic" | "boss" | "legendary";
  playerCharacter: string;
  date: string;
  duration: number;
  frames: ReplayFrame[];
};
