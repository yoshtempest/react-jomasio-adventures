import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNpcAI } from "@/hooks/battle/npc/useNpcAi";
import { useBattleSystem } from "@/hooks/battle/useSystem";
import { useVictory } from "@/hooks/useVictory";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useNavigate } from "react-router";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useLocation } from "react-router";
import { useNpcSetup } from "@/hooks/battle/npc/useNpcSetup";
import { useBattleRewards, type RewardInfo } from "@/hooks/battle/useRewards";
import { useSummons } from "@/hooks/battle/npc/useSummons";
import { usePlayerBattleActions } from "@/hooks/battle/player/usePlayerActions";
import { useSummonAI } from "@/hooks/battle/npc/useSummonsAi";
import { useBattleControls } from "@/hooks/battle/useControls";
import { useComboSystem } from "@/hooks/battle/useComboSystem";
import { useBattleRefs } from "@/hooks/battle/useRefs";
import { useBattleKillCounter } from "@/hooks/battle/useKillCounter";
import { useChargeAttack } from "@/hooks/battle/charge/useAttack";
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
  const { quests } = useQuests();
  const { closeNavbar } = useNavbar();

  const [showDefeat, setShowDefeat] = useState(false);
  const [lastRewards, setLastRewards] = useState<RewardInfo | null>(null);
  const [npcPhase, setNpcPhase] = useState(1);
  const npcPhaseRef = useRef(npcPhase);
  npcPhaseRef.current = npcPhase;
  const [showIntro, setShowIntro] = useState(true);
  const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false);

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

  const { showVictory, triggerVictory } = useVictory({ redirectTo });

  useGameAudio({ src: audioSrc, loop: true, volume: 0.5 });

  const refs = useBattleRefs();

  const clearSummonsRef = useRef(clearSummons);
  clearSummonsRef.current = clearSummons;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;
  const closeInventoryRef = useRef(closeInventory);
  closeInventoryRef.current = closeInventory;
  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;

  const saveDataRef = useRef({ items: inventoryItems, quests, character: player.character, playerClass, hyperCoins, coins });
  saveDataRef.current = { items: inventoryItems, quests, character: player.character, playerClass, hyperCoins, coins };

  const killCounter = useBattleKillCounter();
  killCounter.npcTypeRef.current = npcType;
  killCounter.npcDataRef.current = npcData;

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    playerState: player.state,
    playerDirection: player.battleDirection,
    npcType,
    npcPhaseRef,
    onProjectileHit: () => refs.npcRangedAttackRef.current(),
    onMeleeHit: () => refs.npcMeleeAttackRef.current(),
    isPaused: showVictory || showDefeat || showIntro || isPhaseTransitioning,
    onSummon: summonNpc,
    obstacles: map?.obstacles,
    hitstopRef: refs.hitstopRef,
    npcStaggerRef: refs.npcStaggerRef,
  });

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
    playerMaxHp: battle.playerMaxHp,
    totalVampirism: battle.totalVampirism,
  });

  const isPaused = showVictory || showDefeat || showIntro;

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

  useEffect(() => {
    updateNpcPosition(npc.x);
  }, [npc.x, updateNpcPosition]);

  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (battle.npcPhase === 2) {
      clearSummonsRef.current();
      setIsPhaseTransitioning(true);

      const startPlayerX = player.x;
      const startPlayerY = player.y;
      const startNpcX = npc.x;
      const TARGET_X = 100;
      const TARGET_NPC_X = 900;
      const TARGET_Y = 670;
      const DURATION = 700;

      setPlayer((p) => ({
        ...p,
        state: "walk",
        battleDirection: "right",
      }));
      npc.updateNpc({ direction: "left", state: "walk" });

      const startTime = performance.now();
      let animFrame: number;

      function animate(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / DURATION, 1);
        const ease = 1 - Math.pow(1 - t, 3);

        const px = startPlayerX + (TARGET_X - startPlayerX) * ease;
        const py = startPlayerY + (TARGET_Y - startPlayerY) * ease;
        const nx = startNpcX + (TARGET_NPC_X - startNpcX) * ease;

        setPlayer((p) => ({
          ...p,
          x: px,
          y: py,
          groundY: TARGET_Y,
          velY: 0,
          battleDirection: "right",
        }));
        npc.updateNpc({ x: nx, y: TARGET_Y });

        if (t < 1) {
          animFrame = requestAnimationFrame(animate);
        } else {
          setPlayer((p) => ({
            ...p,
            x: TARGET_X,
            y: TARGET_Y,
            groundY: TARGET_Y,
            velY: 0,
            state: "idle",
            battleDirection: "right",
          }));
          npc.resetNpc("pitch");
          phaseTimeoutRef.current = setTimeout(
            () => setIsPhaseTransitioning(false),
            2500,
          );
        }
      }

      animFrame = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animFrame);
        clearTimeout(phaseTimeoutRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle.npcPhase]);

  useEffect(() => {
    setNpcPhase(battle.npcPhase);
  }, [battle.npcPhase]);

  refs.npcRangedAttackRef.current = () => {
    if (player.state === "charging") charge.cancelCharge();
    battle.npcRangedHit();
  };
  refs.npcMeleeAttackRef.current = () => {
    if (player.state === "charging") charge.cancelCharge();
    battle.npcMeleeHit();
  };

  useEffect(() => {
    setModeRef.current("battle");
    closeInventoryRef.current();
    closeNavbarRef.current();
  }, []);

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
    playerMaxHp: battle.playerMaxHp,
    totalVampirism: battle.totalVampirism,
  });

  useBattleControls({
    attack,
    special,
    handlePlayerHit,
    handleSpecialHit,
    disabled: isPaused || isPhaseTransitioning,
    onChargePress: charge.startCharge,
    onChargeRelease: charge.releaseCharge,
    onChargeCancel: charge.cancelCharge,
  });

  useEffect(() => {
    const timeout = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  function skipIntro() {
    setShowIntro(false);
  }

  function handleRetry() {
    charge.cancelCharge();
    setShowDefeat(false);
    clearSummons();
    battle.resetBattle();
    npc.resetNpc();
    resetBattleState();
    resetCombo();
  }

  function handleContinue() {
    if (onVictory) onVictory();
    if (redirectTo) {
      navigate(redirectTo, { state: { from: location.pathname } });
    }
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
    handleRetry,
    handleContinue,
    navigate,
    showIntro,
    skipIntro,
    comboCount,
    comboRank,
    comboProgress: comboProgressValue,
    nextRank,
    charge,
  };
}
