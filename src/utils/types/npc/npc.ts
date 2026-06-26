export type NPCDirection = "right" | "left";

export type NPCBattleState = {
  x: number;
  y: number;
  state: "idle" | "walk" | "hit" | "jumping" | "pitch" | "inAir" | "falling" | "airAttack" | "preAttack" | "preJump" | "attack" | "inJump" | "jumpAttack" | "block";
  direction: NPCDirection;
  jumpLandingX?: number;

  ai?: {
    slimita?: {
      state: "idle" | "air" | "resting";
      startTime: number;
      targetX: number;
      lastPullThrow: number;
    };
    deise?: {
      knownPhase: number;
      phase2OpeningDone: boolean;
      phase2PitchEnd: number;
      lastStaffThrow: number;
      lastSummon: number;
      lastAction: number;
      lastSpearRain: number;
    };
    hungryKing?: {
      knownPhase: number;
      hasSummoned: boolean;
      jumpState: "idle" | "jumping" | "inJump" | "jumpAttack";
      jumpStartTime: number;
      jumpTargetX: number;
      lastJump: number;
      landingTime: number;
      summonEndTime: number;
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
