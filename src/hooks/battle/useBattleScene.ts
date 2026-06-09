import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNpcAI } from "@/hooks/npc/useNpcAi";
import { useBattleSystem } from "@/hooks/battle/useBattleSystem";
import { useVictory } from "@/hooks/useVictory";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { NPCS } from "@/data/npc";
import { generateNpcLevel } from "@/utils/generateNpcLevel";
import { useNavigate } from "react-router";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useLocation } from "react-router";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { useBattleRewards } from "@/hooks/battle/useBattleRewards";
import { useSummons } from "@/hooks/battle/useSummons";
import { usePlayerBattleActions } from "@/hooks/battle/usePlayerBattleActions";

type Props = {
  npcType: string;
  redirectTo?: string;
  audioSrc: string;
  onVictory?: () => void;
};

export function useBattleScene({
  npcType,
  redirectTo,
  audioSrc,
  onVictory,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    player,
    setMode,
    attack,
    special,
    resetBattleState,
    difficulty,
    playerClass
  } = usePlayer();

  const {
    pushControls,
    popControls
  } = useGameControls();
  
  const {
    progress,
    getXPToNextLevel
  } = useCharacterProgress();

  const { closeInventory } = useInventory();
  const { closeNavbar } = useNavbar();

  const [showDefeat, setShowDefeat] = useState(false);
  const [npcLevel] = useState(() => generateNpcLevel());
  const [npcPhase, setNpcPhase] = useState(1);
  const [showIntro, setShowIntro] = useState(true);
  const summonLastAttacksRef = useRef<Record<string, number>>({});

  const npcData = NPCS[npcType];

  const {
    xpReward,
    giveRewards,
    giveSummonRewards,
  } = useBattleRewards({
    npcClass: npcData.class,
    npcLevel,
  });

  const {
    summons,
    setSummons,
    summonNpc,
    clearSummons,
    updateNpcPosition,
  } = useSummons({
    npcLevel,
    difficulty,
    playerX: player.x,
    playerGroundY: player.groundY,
  });

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const missingXp = xpNeeded - charProgress.xp;

  const npcStats = getNpcStats(npcLevel, npcData.class, difficulty);

  const { showVictory, triggerVictory } = useVictory({ redirectTo });

  useGameAudio({
    src: audioSrc,
    loop: true,
    volume: 0.5,
  });

  const npcRangedAttackRef = useRef<() => void>(() => {});
  const npcMeleeAttackRef = useRef<() => void>(() => {});

  const playerXRef = useRef(player.x);
  playerXRef.current = player.x;
  const playerYRef = useRef(player.y);
  playerYRef.current = player.y;

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    playerState: player.state,
    playerDirection: player.battleDirection,
    npcType,
    npcPhase,
    onProjectileHit: () => npcRangedAttackRef.current(),
    onMeleeHit: () => npcMeleeAttackRef.current(),
    isPaused: showVictory || showDefeat || showIntro,
    onSummon: summonNpc,
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
      giveRewards();
      triggerVictory();
    },
  });

  const {
    handlePlayerHit,
    handleSpecialHit,
  } = usePlayerBattleActions({
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
  });

  // Track NPC position for summon spawns
  useEffect(() => {
    updateNpcPosition(npc.x);
  }, [npc.x, updateNpcPosition]);

  // Despawn summons on boss phase 2
  useEffect(() => {
    if (battle.npcPhase === 2) {
      clearSummons();
    }
  }, [battle.npcPhase]);

  useEffect(() => {
    setNpcPhase(battle.npcPhase);
  }, [battle.npcPhase]);

  npcRangedAttackRef.current = battle.npcRangedHit;
  npcMeleeAttackRef.current = battle.npcMeleeHit;

  useEffect(() => {
    setMode("battle");
    closeInventory();
    closeNavbar();
  }, []);

  const isPaused = showVictory || showDefeat || showIntro;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  // Summon AI — chase + melee
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current) return;

      const px = playerXRef.current;

      setSummons(prev => prev.map(s => {
        if (s.isDying || s.hp <= 0) return s;

        const speed = Math.abs(s.x - px) > 200 ? 3 : 1.5;
        const dx = px - s.x;
        const direction: "left" | "right" = dx > 0 ? "right" : "left";

        let newX = s.x;
        if (Math.abs(dx) > 40) {
          newX += dx > 0 ? speed : -speed;
        }

        if (Math.abs(dx) <= 40) {
          const now = Date.now();
          const lastAttack = summonLastAttacksRef.current[s.id] ?? 0;
          if (now - lastAttack >= 800) {
            summonLastAttacksRef.current[s.id] = now;
            const data = NPCS[s.npcType];
            if (data) {
              const stats = getNpcStats(npcLevel, data.class, difficulty);
              const dmg = calculateNpcDamage(stats.damage, playerClass);
              battle.damagePlayer(dmg);
            }
          }
        }

        return {
          ...s,
          x: newX,
          direction,
          state: Math.abs(dx) > 80 ? "walk" : "idle",
        };
      }));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Remove dead summons after delay
  useEffect(() => {
    const dying = summons.filter(s => s.hp <= 0 && !s.isDying);
    if (dying.length === 0) return;

    const timeouts = dying.map(s => {
      setSummons(prev => prev.map(s2 => s2.id === s.id ? { ...s2, isDying: true } : s2));
      return window.setTimeout(() => {
        setSummons(prev => prev.filter(s2 => s2.id !== s.id));
      }, 500);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [summons]);


  const attackRef = useRef(attack);
  const specialRef = useRef(special);
  const playerHitRef = useRef(handlePlayerHit);
  const specialHitRef = useRef(handleSpecialHit);
  attackRef.current = attack;
  specialRef.current = special;
  playerHitRef.current = handlePlayerHit;
  specialHitRef.current = handleSpecialHit;

  useEffect(() => {
    if (showVictory || showDefeat || showIntro) return;

    const controls = {
      onConfirm: () => {
        attackRef.current();
        playerHitRef.current();
      },
      onCancel: () => {
        specialRef.current();
        specialHitRef.current();
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [showVictory, showDefeat, showIntro]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowIntro(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  function skipIntro() {
    setShowIntro(false);
  }

  function handleRetry() {
    setShowDefeat(false);
    clearSummons();
    battle.resetBattle();
    npc.resetNpc();
    resetBattleState();
  }

  function handleContinue() {
    if (onVictory) onVictory();

    if (redirectTo) {
      navigate(redirectTo, {
        state: { from: location.pathname }
      });
    }
  }

  return {
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    summons,
    charProgress,
    missingXp,
    xpReward,
    showVictory,
    showDefeat,
    handleRetry,
    handleContinue,
    navigate,
    showIntro,
    skipIntro,
  };
}
