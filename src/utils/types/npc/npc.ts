export type NPCDirection = "right" | "left";

export type NPCBattleState = {
  x: number;
  y: number;
  state:
    "idle"
    | "walk"
    | "default"
    | "hit"
    | "jumping"
    | "pitch"
    | "inAir"
    | "falling"
    | "airAttack"
    | "preAttack"
    | "preJump"
    | "attack"
    | "inJump"
    | "jumpAttack"
    | "block"
    | "meleeAttack"
    | "rangedAttack"
    | "get"
    | "throw"
    | "startDash"
    | "inDash";
  direction: NPCDirection;
  jumpLandingX?: number;

  ai?: {
    slimita?: {
      state: "idle" | "air" | "resting";
      startTime: number;
      targetX: number;
      lastPullThrow: number;
      lastMeleeAttack: number;
      lastRangedAttack: number;
      phase1HopState: "ground" | "jumping";
      phase1HopStart: number;
      phase1HopStartX: number;
      phase1BaseY: number;
      phase1DashState: "idle" | "dashing";
      phase1DashStart: number;
      phase1DashStartX: number;
      phase1DashTargetX: number;
      phase1DashHitDone: boolean;
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
      lastSpriteState?: string;
    };
    vandinha?: {
      lastMeleeAttack: number;
      lastRangedAttack: number;
    };
    jhowsimar?: {
      attackCount: number;
      grabPhase: "get" | "throw" | null;
      startTime: number;
    };
    hungryDeath?: {
      grabPhase: "grabbing" | null;
      grabStartTime: number;
      attackCount: number;
      lastMeleeAttack: number;
      lastGrabEndTime: number;
    };
    goat?: {
      jumpState: "idle" | "jumping" | "inJump" | "jumpAttack";
      jumpStartTime: number;
      jumpTargetX: number;
      lastJump: number;
      landingTime: number;
      lastSpriteState?: string;
      lastMeleeAttack: number;
    };
    maurao?: {
      dashState: "idle" | "windUp" | "dashing" | "postDash";
      dashStart: number;
      dashStartX: number;
      dashTargetX: number;
      dashHitDone: boolean;
      lastMeleeAttack: number;
      postDashStart: number;
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
