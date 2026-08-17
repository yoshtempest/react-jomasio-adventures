import { QUESTS } from "@/data/quests";
import { ITEMS } from "@/data/items";
import { FLAGS } from "@/data/flags";
import { CHARACTERS } from "@/utils/types/player/player";

export {};

declare global {
  // ── Primitives ──────────────────────────────────────────
  type LastPage = string | undefined;
  type Direction = "up" | "down" | "left" | "right";
  type playerState = string;
  type EquipmentId = string;

  // ── IDs (derivados de dados estáticos) ──────────────────
  type QuestId = Extract<keyof typeof QUESTS, string>;
  type ItemId = Extract<keyof typeof ITEMS, string>;
  type FlagId = Extract<keyof typeof FLAGS, string>;
  type CharacterId = (typeof CHARACTERS)[number];

  // ── Geometria ───────────────────────────────────────────
  type Position = { x: number; y: number };
  type ExplorePosition = {
    x: number;
    y: number;
    direction: Direction;
  };
  type PlayerPosition = {
    gridX: number;
    gridY: number;
    direction: Direction;
  };
  type ReplayViewportSize = {
    width: number;
    height: number;
  };

  // ── Stats (repetido em equipment, character, titles) ──
  type StatBlock = {
    hp: number;
    strength: number;
    intelligence: number;
    armor: number;
    shield: number;
    vampirism: number;
    reflect: number;
    tenacity: number;
    luck: number;
    maxHpDamage: number;
    trueDamage: number;
  };

  // ── Áudio / Transição ──────────────────────────────────
  type AudioConfig = {
    src: string;
    loop?: boolean;
    volume?: number;
  };

  type Transition = {
    positions: Position[];
    to: string;
    state?: string;
  };

  // ── Diálogo ────────────────────────────────────────────
  type Dialogue = {
    src?: string;
    name: string;
    message: string;
    isPlayer?: boolean;
    soundSrc?: string;
    autoAdvanceOnSound?: boolean;
  };

  // ── Scene system ───────────────────────────────────────
  type SceneId =
    | "one"
    | "two"
    | "jailson-one"
    | "jailson-two"
    | "three"
    | "four"
    | "five"
    | "six"
    | "seven"
    | "eight"
    | "nine"
    | "afterpcroom-one"
    | "left-one"
    | "center-one"
    | "center-two"
    | "center-front"
    | "thirdclass"
    | "hell"
    | "secret-passage"
    | "footballcourt"
    | "pandemony";

  type SceneTile = {
    x: number;
    y: number;
    route?: string;
    getRoute?: (player: ExplorePosition, quests: Quest[], flags: FlagId[]) => string | null;
    requiredQuest?: QuestId;
    blockedMessage?: string;
  };

  type SceneSign = {
    x: number;
    y: number;
    message: string;
  };

  type ScenePlateData = {
    src: string;
    gridX: number;
    gridY: number;
    message?: string;
  };

  type SceneCutscene = {
    videoSrc: string;
    npcGridX: number;
    npcGridY: number;
  };

  type SceneEvent =
    | { type: "openModal"; modal: "class" }
    | { type: "navigate"; to: string; delay?: number }
    | { type: "playSound"; src: string; volume?: number }
    | { type: "setFlag"; flagId: FlagId }
    | { type: "log"; message: string }
    | { type: "progressQuest"; id: QuestId; value: number }
    | { type: "giveQuest"; questId: QuestId }
    | { type: "addItem"; itemId: ItemId }
    | { type: "removeItem"; itemId: ItemId }
    | {
        type: "conditional";
        condition: {
          hasItem?: ItemId;
          notHasItem?: ItemId;
          hasQuest?: QuestId;
          notHasQuest?: QuestId;
          hasFlag?: FlagId;
          notHasFlag?: FlagId;
          lastPage?: LastPage;
          notLastPage?: LastPage;
        };
        then: SceneEvent[];
        else?: SceneEvent[];
      };

  type DialogueContext = {
    quests: Quest[];
    items: { id: ItemId }[];
    flags: FlagId[];
    character: CharacterId;
    lastPage?: LastPage;
  };

  type NpcSrcResolver = (context: DialogueContext) => string;

  type SceneNPCData = {
    src: string | NpcSrcResolver;
    gridX: number;
    gridY: number;
    interaction?: (startDialogue: (d: Dialogue[]) => void) => void;
  };

  type ExploreSceneProps = {
    name?: string;
    map: number[][];
    heightMap?: number[][];
    dialogueData?: Dialogue[] | ((context: DialogueContext) => Dialogue[]);
    nextRoute?: string;
    initialPosition?:
      ExplorePosition | ((lastPage?: LastPage) => ExplorePosition);
    npcs?: SceneNPCData[];
    plates?: ScenePlateData[];
    audio?: AudioConfig;
    transitions?: Transition[];
    signs?: SceneSign[];
    onInteract?: (tile: number, x: number, y: number) => boolean;
    autoStartDialogue?: boolean | ((context: DialogueContext) => boolean);
    cutscene?: SceneCutscene;
    onFinish?: () => void;
    className?: string;
    lastPage?: LastPage;
    backgroundSize?: string;
    scaleFix?: number;
  };

  type SceneConfig = Omit<ExploreSceneProps, "onInteract" | "className"> & {
    id: SceneId;
    background?: string;
    events?: SceneEvent[];
    tiles?: SceneTile[];
    plates?: ScenePlateData[];
    signs?: SceneSign[];
  };

  // ── NPC ─────────────────────────────────────────────────
  type NPCClass = "common" | "rare" | "epic" | "boss" | "legendary";
  type NpcDifficulty = "easy" | "medium" | "hard" | "insano";
  type EquipmentRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | "EX";

  type ProjectileCommon = {
    variant: "common";
    x: number;
    y: number;
    startX: number;
    startY: number;
    dirX: number;
    dirY: number;
    sprite?: string;
    createdAt: number;
    state: "walk" | "idle";
  };

  type ProjectilePull = {
    variant: "pull";
    x: number;
    y: number;
    startX: number;
    startY: number;
    dirX: number;
    dirY: number;
    sprite?: string;
    createdAt: number;
    state: "walk" | "idle";
    pullTargetX: number;
  };

  type FallingSpear = {
    x: number;
    y: number;
    hit?: boolean;
  };

  type ProjectileRain = {
    variant: "rain";
    x: number;
    y: number;
    startX: number;
    startY: number;
    createdAt: number;
    sprite?: string;
    warningStartTime: number;
    warningDuration: number;
    spears: FallingSpear[];
  };

  type Projectile = ProjectileCommon | ProjectilePull | ProjectileRain;

  // ── Player ──────────────────────────────────────────────
  type PlayerState =
    | "idle"
    | "walk"
    | "attack"
    | "jump"
    | "blocked"
    | "stun"
    | "special"
    | "dash"
    | "charging"
    | "preAttack"
    | "preWalk"
    | "preJump"
    | "preSpecial"
    | "preRun"
    | "run"
    | "crit"
    | "falling"
    | "fallingAttack"
    | "preSpecialInAir"
    | "specialInAir"
    | "specialInAirFinish"
    | "blockAttack"
    | "idleCrounched"
    | "walkCrounched"
    | "fallen";

  type PlayerMode = "explore" | "battle" | "select" | "ui" | "map" | "menu";

  type PlayerClass = "fracote" | "idiota" | "amostradinho" | null;

  type Player = {
    gridX: number;
    gridY: number;
    height: number;
    direction: Direction;
    character: CharacterId;
    x: number;
    y: number;
    velY: number;
    groundY: number;
    battleDirection: Direction;
    state: PlayerState;
    mode: PlayerMode;
    hasPeru?: boolean;
    moving?: boolean;
    grabbedUntil?: number;
    bleedUntil: number;
    burnUntil: number;
    poisonUntil: number;
    paralyzedUntil: number;
    blindUntil: number;
    confusedUntil: number;
    frozenUntil: number;
    halfHealUntil: number;
    pullFromX: number;
    pullToX: number;
    pullStartTime: number;
    throwStartTime: number;
    throwFromX: number;
    throwToX: number;
  };

  // ── Quest ───────────────────────────────────────────────
  type QuestType = "history" | "sidequest";
  type QuestRewardsType = "xp" | "item" | "coin" | "hyperCoin";
  type QuestFrequency = "daily" | "weekly";

  type Quest = {
    id: string;
    name: string;
    image: string;
    description: string;
    type: QuestType;
    counter: number;
    progress: number;
    completed: boolean;
    rewardsType?: QuestRewardsType;
    rewards?: number;
    claimed?: boolean;
    frequency?: QuestFrequency;
    rewardItemId?: string;
    progressType?: string;
  };

  type RewardProgress = {
    id: string;
    label: string;
    current: number;
    requirement: number;
    reward: number;
    canClaim: boolean;
    charId?: string;
  };

  export type EquipmentSlot =
    | "weapon"
    | "helmet"
    | "chestplate"
    | "pants"
    | "boots"
    | "accessory"
    | "bag"
    | "pet";

  type EquipmentDropInfo = {
    id: string;
    name: string;
    slot: EquipmentSlot;
    rank: EquipmentRank;
    enhance: number;
  };

  type ItemDropInfo = {
    id: string;
    name: string;
    image?: string;
    qty: number;
  };

  type RewardInfo = {
    coinReward: number;
    xpReward: number;
    equipmentDrops: EquipmentDropInfo[];
    itemDrops: ItemDropInfo[];
    chestDrop: { id: string; name: string } | null;
    keyDrop: { id: string; name: string } | null;
  };

  type DamageType =
    | "player"
    | "npc"
    | "special"
    | "pet"
    | "summon"
    | "blocked"
    | "crit"
    | "charge"
    | "reflect"
    | "miss"
    | "bleed"
    | "burn"
    | "poison"
    | "confuse";
}
