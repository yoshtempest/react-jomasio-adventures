export type NPCDirection = "right" | "left";

export type NPCBattleState = {
  x: number;
  y: number;
  state: "idle" | "walk" | "hit" | "jumping" | "pitch" | "inAir" | "falling" | "airAttack" | "preAttack" | "preJump" | "attack";
  direction: NPCDirection;
  jumpLandingX?: number;
  dangerZones?: Array<{ x: number; startTime: number }>;
  fallingSpears?: Array<{ x: number; y: number; hit?: boolean }>;

  ai?: {
    slimita?: {
      state: "idle" | "air" | "resting";
      startTime: number;
      targetX: number;
    };
    deise?: {
      knownPhase: number;
      phase2OpeningDone: boolean;
      phase2PitchEnd: number;
      lastStaffThrow: number;
      lastSummon: number;
      lastAction: number;
      spearRainPhase: "idle" | "warning" | "falling";
      lastSpearRain: number;
      spearRainWarningStart: number;
      spearRainPositions: number[];
    };
    hungryKing?: {
      knownPhase: number;
      hasSummoned: boolean;
    };
  };
};

export type SummonedNpc = {
  id: string;
  npcType: string;
  x: number;
  y: number;
  direction: NPCDirection;
  state: "idle" | "walk" | "attack";
  hp: number;
  maxHp: number;
  isDying: boolean;
};
