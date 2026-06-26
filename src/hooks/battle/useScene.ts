import { useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { useNpcAI } from "@/hooks/battle/npc/useAi";
import { useBattleSystem } from "@/hooks/battle/useSystem";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useNavigate, useLocation } from "react-router";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useNpcSetup } from "@/hooks/battle/npc/useSetup";
import { useBattleRewards } from "@/hooks/battle/rewards/useRewards";
import { useSummons } from "@/hooks/battle/summon/useSummons";
import { usePlayerBattleActions } from "@/hooks/battle/player/usePlayerActions";
import { useSummonAI } from "@/hooks/battle/summon/useAi";
import { useBattleControls } from "@/hooks/battle/useControls";
import { useComboSystem } from "@/hooks/battle/useComboSystem";
import { useBattleRefs } from "@/hooks/battle/useRefs";
import { useBattleKillCounter } from "@/hooks/battle/useKillCounter";
import { useChargeAttack } from "@/hooks/battle/charge/useAttack";
import { usePhaseTransition } from "@/hooks/battle/usePhaseTransition";
import { useBattleIntro } from "@/hooks/battle/useIntro";
import { useBattleOutro } from "@/hooks/battle/useOutro";
import { useBattleSync } from "@/hooks/battle/useSync";
import type { BattleMapConfig } from "@/utils/types/maps/battle";
import { saveGame } from "@/utils/saveGame";

type Props = {
  npcType: string;
  redirectTo?: string;
  audioSrc: string;
  onVictory?: () => void;
  map?: BattleMapConfig;
};

export function useBattleScene({
  npcType,
  redirectTo,
  audioSrc,
  onVictory,
  map,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    player,
    setPlayer,
    setMode,
    attack,
    special,
    resetBattleState,
    difficulty,
    playerClass,
    setPlayerState,
    lastBlockPressRef,
    coins,
    hyperCoins,
  } = usePlayer();

  const { progress, getXPToNextLevel } = useCharacterProgress();
  const { items: inventoryItems, closeInventory } = useInventory();
  const { quests, progressDailyWeekly } = useQuests();
  const { closeNavbar } = useNavbar();

  const [npcPhase, setNpcPhase] = useState(1);
  const npcPhaseRef = useRef(npcPhase);
  npcPhaseRef.current = npcPhase;
  const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false);

  const { showIntro, skipIntro } = useBattleIntro();

  const { npcData, npcLevel, npcStats } = useNpcSetup(npcType, difficulty);

  const { xpReward, giveRewards, giveSummonRewards } = useBattleRewards({
    npcClass: npcData.class,
    npcLevel,
    npcType,
  });

  const { summons, setSummons, summonNpc, clearSummons, updateNpcPosition } =
    useSummons({
      npcLevel,
      difficulty,
      playerX: player.x,
      playerGroundY: player.groundY,
    });

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const missingXp = xpNeeded - charProgress.xp;

  const {
    showVictory,
    triggerVictory,
    showDefeat,
    setShowDefeat,
    showOutro,
    skipVictoryDelay,
    lastRewards,
    setLastRewards,
    handleCloseOutro,
    handleContinue,
  } = useBattleOutro({ redirectTo, onVictory });

  useGameAudio({ src: audioSrc, loop: true, volume: 0.5 });

  const refs = useBattleRefs();

  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;
  const closeInventoryRef = useRef(closeInventory);
  closeInventoryRef.current = closeInventory;
  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;

  const saveDataRef = useRef({
    items: inventoryItems,
    quests,
    character: player.character,
    playerClass,
    hyperCoins,
    coins,
  });
  saveDataRef.current = {
    items: inventoryItems,
    quests,
    character: player.character,
    playerClass,
    hyperCoins,
    coins,
  };

  const killCounter = useBattleKillCounter();
  killCounter.npcTypeRef.current = npcType;
  killCounter.npcDataRef.current = npcData;

  const isPaused = showVictory || showDefeat || showIntro || showOutro != null;

  // 🎯 NPC targeting refs — shared between AI and battle system
  const npcTargetIsPetRef = useRef(false);
  const petXRef = useRef(0);
  const petYRef = useRef(0);
  const hasPetRef = useRef(false);

  const npcAiHpRef = useRef(npcStats.hp);
  const npcAiMaxHpRef = useRef(npcStats.hp);

  const npcBlockedRef = useRef(false);
  const npcBlockTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const onBeforeNpcHitRef = useRef<() => boolean>(() => false);

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    playerState: player.state,
    playerDirection: player.battleDirection,
    npcType,
    npcPhaseRef,
    onProjectileHit: () => refs.npcRangedAttackRef.current(),
    onMeleeHit: () => refs.npcMeleeAttackRef.current(),
    isPaused: isPaused || isPhaseTransitioning,
    onSummon: summonNpc,
    onPullPlayer: (x: number) => setPlayer((p) => ({ ...p, x })),
    obstacles: map?.obstacles,
    hitstopRef: refs.hitstopRef,
    npcStaggerRef: refs.npcStaggerRef,
    petXRef,
    petYRef,
    hasPetRef,
    npcTargetIsPetRef,
    npcHpRef: npcAiHpRef,
    npcMaxHpRef: npcAiMaxHpRef,
    npcBlockedRef,
  });

  onBeforeNpcHitRef.current = () => {
    if (npcType !== "piupiu") return false;
    const distanceX = Math.abs(npc.x - player.x);
    const distanceY = Math.abs(npc.y - player.y);
    if (distanceX > 50 || distanceY > 150) return false;
    if (Math.random() < 0.8) {
      npcBlockedRef.current = true;
      npc.updateNpc({ state: "block" });
      clearTimeout(npcBlockTimerRef.current);
      npcBlockTimerRef.current = setTimeout(() => {
        npcBlockedRef.current = false;
      }, 300);
      return true;
    }
    return false;
  };

  const battle = useBattleSystem({
    playerX: player.x,
    playerY: player.y,
    npcX: npc.x,
    npcY: npc.y,
    playerState: player.state,
    npcLevel,
    npcClass: npcData.class,
    difficulty,
    onPlayerDeath: () => setShowDefeat(true),
    onNpcDeath: () => {
      const rewards = giveRewards();
      setLastRewards(rewards);

      progressDailyWeekly("win_battle", 1);
      progressDailyWeekly("kill_any", 1);

      const npcClass = killCounter.npcDataRef.current.class;
      if (npcClass === "common") progressDailyWeekly("kill_common", 1);
      else if (npcClass === "rare") progressDailyWeekly("kill_rare", 1);
      else if (npcClass === "epic") progressDailyWeekly("kill_epic", 1);
      else if (npcClass === "boss") progressDailyWeekly("kill_boss", 1);

      const d = saveDataRef.current;
      saveGame({
        lastRoute: location.pathname,
        inventory: d.items,
        quests: d.quests,
        playerClass: d.playerClass,
        character: d.character,
        hyperCoins: d.hyperCoins,
      });
      triggerVictory();
      killCounter.handleNpcDeath(
        killCounter.npcTypeRef.current,
        killCounter.npcDataRef.current.class,
      );
    },
    hitstopRef: refs.hitstopRef,
    npcStaggerRef: refs.npcStaggerRef,
    registerHitRef: refs.registerHitRef,
    setPlayer,
    lastBlockPressRef,
    npcPhaseRef,
    npcTargetIsPetRef,
    petXRef,
    petYRef,
    onBeforeNpcHitRef,
  });

  const {
    comboCount,
    comboRank,
    progress: comboProgressValue,
    nextRank,
    registerHit,
    resetCombo,
  } = useComboSystem({ npcMaxHp: battle.npcMaxHp });
  refs.registerHitRef.current = registerHit;
  refs.spawnDamageRef.current = battle.spawnDamageNumber;

  const { handlePlayerHit, handleSpecialHit } = usePlayerBattleActions({
    player,
    npc,
    summons,
    setSummons,
    npcHP: battle.npcHP,
    playerClass,
    progress,
    npcLevel,
    battle,
    giveSummonRewards,
    spawnDamageRef: refs.spawnDamageRef,
    registerHitRef: refs.registerHitRef,
    setPlayerHP: battle.setPlayerHP,
    playerHP: battle.playerHP,
    playerMaxHp: battle.playerMaxHp,
    totalVampirism: battle.totalVampirism,
  });

  useSummonAI({
    summons,
    setSummons,
    isPaused,
    playerX: player.x,
    playerY: player.y,
    playerClass,
    npcLevel,
    difficulty,
    damagePlayer: battle.damagePlayer,
    spawnDamageRef: refs.spawnDamageRef,
    hitstopRef: refs.hitstopRef,
  });

  // Refs that depend on battle (must live after useBattleSystem)
  const npcMaxHpRef = useRef(battle.npcMaxHp);
  npcMaxHpRef.current = battle.npcMaxHp;
  const setNpcHPRef = useRef(battle.setNpcHP);
  setNpcHPRef.current = battle.setNpcHP;
  const isEndingRef = useRef(battle.isEnding);
  isEndingRef.current = battle.isEnding;

  usePhaseTransition({
    npcPhase: battle.npcPhase,
    player,
    setPlayer,
    npc,
    clearSummons,
    setIsPhaseTransitioning,
  });

  const charge = useChargeAttack({
    player,
    setPlayer,
    npcX: npc.x,
    npcY: npc.y,
    npcArmor: battle.npcArmor,
    char: battle.char,
    playerClass,
    critRate: battle.critRate,
    titleDamageBonus: battle.titleDamageBonus,
    setNpcHP: battle.setNpcHP,
    playerCooldown: battle.playerCooldown,
    isEnding: battle.isEnding,
    hitstopRef: refs.hitstopRef,
    spawnDamageRef: refs.spawnDamageRef,
    registerHitRef: refs.registerHitRef,
    setPlayerState,
    summons,
    setSummons,
    setDelicia: battle.setDelicia,
    hitsToSpecial: battle.hitsToSpecial,
    setPlayerHP: battle.setPlayerHP,
    playerHP: battle.playerHP,
    playerMaxHp: battle.playerMaxHp,
    totalVampirism: battle.totalVampirism,
  });

  useBattleSync({
    battle,
    petXRef,
    petYRef,
    hasPetRef,
    npcAiHpRef,
    npc,
    updateNpcPosition,
    npcType,
    npcMaxHpRef,
    setNpcHPRef,
    isEndingRef,
    setNpcPhase,
    setModeRef,
    closeInventoryRef,
    closeNavbarRef,
    refs,
    charge,
    player,
    battleNpcRangedHit: battle.npcRangedHit,
    battleNpcMeleeHit: battle.npcMeleeHit,
  });

  useBattleControls({
    attack,
    special,
    blockStart: () =>
      setPlayer((p) => {
        if (p.state === "jump") return p;
        return { ...p, state: "blocked" };
      }),
    blockEnd: () =>
      setPlayer((p) => {
        if (p.state !== "blocked") return p;
        return { ...p, state: "idle" };
      }),
    handlePlayerHit,
    handleSpecialHit,
    disabled: isPaused || isPhaseTransitioning,
    onChargePress: charge.startCharge,
    onChargeRelease: charge.releaseCharge,
    onChargeCancel: charge.cancelCharge,
  });

  function handleRetry() {
    charge.cancelCharge();
    setShowDefeat(false);
    clearSummons();
    battle.resetBattle();
    npc.resetNpc();
    resetBattleState();
    resetCombo();
  }

  return {
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    summons,
    pet: battle.pet,
    charProgress,
    missingXp,
    xpReward,
    lastRewards,
    showVictory,
    showDefeat,
    showOutro,
    handleCloseOutro,
    handleRetry,
    handleContinue,
    navigate,
    showIntro,
    skipIntro,
    skipVictoryDelay,
    comboCount,
    comboRank,
    comboProgress: comboProgressValue,
    nextRank,
    charge,
  };
}
