import { useEffect, useRef, useState, useCallback } from "react";
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
import { calculatePlayerDamage } from "@/gameRules/battle/damage";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { isPlayerInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { useBattleRewards } from "@/hooks/battle/useBattleRewards";

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

  const { player, setMode, attack, special, resetBattleState, difficulty, addCoins, playerClass } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const { addXP, progress, getXPToNextLevel } = useCharacterProgress();
  const { closeInventory } = useInventory();
  const { closeNavbar } = useNavbar();

  const [showDefeat, setShowDefeat] = useState(false);
  const [npcLevel] = useState(() => generateNpcLevel());
  const [npcPhase, setNpcPhase] = useState(1);
  const [showIntro, setShowIntro] = useState(true);
  const [summons, setSummons] = useState<SummonedNpc[]>([]);
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

  const SPAWN_POSITIONS = [700, 1050];

  const npcXRef = useRef(900);

  function summonNpc(npcType: string) {
    const data = NPCS[npcType];
    if (!data) return;

    const maxHp = getNpcStats(npcLevel, data.class, difficulty).hp;
    const taken = summons.map(s => s.x);
    const free = SPAWN_POSITIONS.find(pos => !taken.includes(pos));
    const spawnX = free ?? npcXRef.current;

    setSummons(prev => [...prev, {
      id: `summon_${Date.now()}`,
      npcType,
      x: spawnX,
      y: player.groundY,
      direction: spawnX < player.x ? "right" : "left",
      state: "walk",
      hp: maxHp,
      maxHp,
      isDying: false,
    }]);
  }

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

  // Track NPC position for summon spawns
  useEffect(() => {
    npcXRef.current = npc.x;
  }, [npc.x]);

  // Despawn summons on boss phase 2
  useEffect(() => {
    if (battle.npcPhase === 2) {
      setSummons([]);
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

  const handlePlayerHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) return;

    const targets: { id: string; x: number; y: number }[] = [];

    if (battle.npcHP > 0) targets.push({ id: "main", x: npc.x, y: npc.y });
    for (const s of summons) {
      if (s.hp > 0 && !s.isDying) targets.push({ id: s.id, x: s.x, y: s.y });
    }

    targets.sort((a, b) => {
      const da = Math.abs(player.x - a.x);
      const db = Math.abs(player.x - b.x);
      return da - db;
    });

    const char = progress[player.character];

    for (const target of targets) {
      if (target.id === "main") {
        battle.playerHit();
        return;
      }

      if (
        isPlayerInRange(
          player.x,
          player.y,
          target.x,
          target.y,
          player.state,
          player.character,
          false
        ) &&
        isFacingTarget(
          player.x,
          player.y,
          target.x,
          target.y,
          player.battleDirection
        )
      ) {
        const targetSummon = summons.find(s => s.id === target.id);
        if (!targetSummon) return;

        const dmg = Math.round(calculatePlayerDamage(char.stats.strength, playerClass));
        const newHp = Math.max(0, Math.round(targetSummon.hp) - dmg);

        if (newHp <= 0) {
          giveSummonRewards("rare");
        }

        setSummons(prev => prev.map(s =>
          s.id === target.id ? { ...s, hp: newHp } : s
        ));
        return;
      }
    }
  }, [
    player.x,
    player.y,
    player.state,
    player.battleDirection,
    player.character,
    npc.x, npc.y,
    battle.npcHP,
    summons,
    playerClass,
    progress,
    battle.playerCooldown,
    battle.isEnding,
    battle.playerHit,
    addXP,
    addCoins,
    npcLevel
  ]);

  const handleSpecialHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) return;

    const targets: { id: string; x: number; y: number }[] = [];

    if (battle.npcHP > 0) targets.push({ id: "main", x: npc.x, y: npc.y });
    for (const s of summons) {
      if (s.hp > 0 && !s.isDying) targets.push({ id: s.id, x: s.x, y: s.y });
    }

    targets.sort((a, b) => {
      const da = Math.abs(player.x - a.x);
      const db = Math.abs(player.x - b.x);
      return da - db;
    });

    for (const target of targets) {
      if (target.id === "main") {
        battle.specialHit();
        return;
      }
    }
  }, [
    player.x,
    player.y,
    player.character,
    npc.x, npc.y,
    battle.npcHP,
    summons,
    progress,
    battle.playerCooldown,
    battle.isEnding,
    battle.specialHit
  ]);

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
    setSummons([]);
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
