import type { useBattleSystem } from "@/hooks/battle/main/useSystem";
import type { useNpcAI } from "@/hooks/battle/npc/useAi";
import type { useChargeAttack } from "@/hooks/battle/charge/useAttack";
import type { useArturOraPunch } from "@/hooks/battle/player/characters/srGuaxinim/useArturOraPunch";
import type { useArturKillerQueen } from "@/hooks/battle/player/characters/srGuaxinim/useArturKillerQueen";
import type { useKokusenAnimation } from "@/hooks/battle/player/characters/natsuki/useKokusenAnimation";
import type { useBlackFlashAnimation } from "@/hooks/battle/player/characters/natsuki/useBlackFlashAnimation";
import type { useSpecialIntro } from "@/hooks/battle/modals/useSpecialIntro";
import type { usePlayerSpecialProjectile } from "@/hooks/battle/player/usePlayerSpecialProjectile";
import type { useCoffinAnimation } from "@/hooks/battle/summon/useCoffinAnimation";
import type { useNpcSetup } from "@/hooks/battle/npc/useSetup";
import type { useEmanuelClone } from "@/hooks/battle/player/characters/ematron/useEmanuelClone";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { CharactersProgress } from "@/data/characters/defaultProgress";
import type { ReplayData } from "@/utils/types/replay";
import type { NavigateFunction } from "react-router";

type Battle = ReturnType<typeof useBattleSystem>;
type Npc = ReturnType<typeof useNpcAI>;

export type BattleSceneApi = {
  player: Player;
  npc: Npc;
  battle: Battle;
  npcStats: ReturnType<typeof useNpcSetup>["npcStats"];
  npcLevel: number;
  summons: SummonedNpc[];
  allies: SummonedNpc[];
  coffins: ReturnType<typeof useCoffinAnimation>["coffins"];
  pet: Battle["pet"];
  petSkill: Battle["petSkill"];
  charProgress: CharactersProgress[CharacterId];
  missingXp: number;
  xpReward: number;
  lastRewards: unknown;
  showVictory: boolean;
  showDefeat: boolean;
  showOutro: unknown;
  showHighlight: boolean;
  highlightData: unknown;
  handleCloseHighlight: () => void;
  handleCloseOutro: () => void;
  handleRetry: () => void;
  handleContinue: () => void;
  navigate: NavigateFunction;
  showIntro: boolean;
  skipIntro: () => void;
  skipVictoryDelay: boolean;
  comboCount: number;
  comboRank: string;
  comboProgress: number;
  nextRank: string | null;
  charge: ReturnType<typeof useChargeAttack>;
  defeatElapsed: number;
  victoryElapsed: number;
  bestTime: number;
  defeatProgress: number;
  grabFlipped: boolean;
  getReplayData: () => ReplayData | null;
  isRecording: boolean;
  training: boolean | undefined;
  controlsDisabled: boolean;
  showRetry: boolean;
  playerProjectile: ReturnType<
    typeof usePlayerSpecialProjectile
  >["playerProjectile"];
  killerQueen: ReturnType<typeof useArturKillerQueen>["killerQueen"];
  bombTargets: ReturnType<typeof useArturKillerQueen>["bombTargets"];
  killerQueenSprite: ReturnType<
    typeof useArturKillerQueen
  >["killerQueenSprite"];
  bombSprite: ReturnType<typeof useArturKillerQueen>["bombSprite"];
  explosionSprite: ReturnType<typeof useArturKillerQueen>["explosionSprite"];
  extraPunches: ReturnType<typeof useArturOraPunch>["punches"];
  extraPunchSprite: string;
  lucasWeapon: LucasWeapon | undefined;
  switchWeapon: () => void;
  convertCursedEnergy: () => void;
  blink: () => void;
  blinkVisual:
    | import("@/hooks/battle/player/characters/natsuki/useBlinkAnimation").BlinkVisual
    | null;
  divergentFistActive: boolean;
  activateDivergentFist: () => void;
  divergentFistFrame: number | null;
  honoredOneActive: boolean;
  kokusenActive: ReturnType<typeof useKokusenAnimation>["kokusenActive"];
  kokusenFrame: ReturnType<typeof useKokusenAnimation>["kokusenFrame"];
  blackFlashActive: ReturnType<
    typeof useBlackFlashAnimation
  >["blackFlashActive"];
  blackFlashVariant: ReturnType<
    typeof useBlackFlashAnimation
  >["blackFlashVariant"];
  vastolordActive: boolean;
  vastolordRemainingMs: number;
  specialIntroActive: ReturnType<typeof useSpecialIntro>["specialIntroActive"];
  specialIntroCharacter: ReturnType<
    typeof useSpecialIntro
  >["specialIntroCharacter"];
  lootBags: import("@/utils/types/battle/loot").BattleLootBag[];
  lootActive: boolean;
  lootNotifications: import("@/utils/types/battle/loot").LootNotification[];
  clearLootNotifications: () => void;
  npcClass: NPCClass;
  emanuelClone: ReturnType<typeof useEmanuelClone>["cloneVisual"];
  clonePress: () => void;
  cloneRelease: () => void;
  cloneUsable: boolean;
};
