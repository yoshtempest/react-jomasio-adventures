import { useState, useRef, useEffect } from "react";
import { calculateDamageToNpc } from "@/gameRules/battle/damage";
import { getBlockLimit } from "@/gameRules/battle/equipment";
import { battleBehaviors } from "@/gameRules/battle/behaviors/player";

import { useBattleStats } from "@/hooks/battle/useStats";
import { useBattleHP } from "@/hooks/battle/useHP";
import { useBattleCooldowns } from "@/hooks/battle/useCooldowns";
import { useBattleEffects } from "@/hooks/battle/useEffects";
import { usePlayerBattle } from "@/hooks/battle/player/usePlayer";
import { useNpcBattle } from "@/hooks/battle/npc/useNpc";
import { useBattleLifecycle } from "@/hooks/battle/useLifecycle";
import { usePetBattle } from "@/hooks/battle/player/usePet";
import { useDamageNumbers } from "@/hooks/battle/useDamageNumbers";

type Props = {
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  npcLevel: number;
  npcClass: "common" | "rare" | "epic" | "boss" | "legendary";
  onPlayerDeath: () => void;
  onNpcDeath: () => void;
  playerState: playerState;
  difficulty: NpcDifficulty;
  hitstopRef: React.RefObject<number>;
  npcStaggerRef: React.RefObject<number>;
  registerHitRef: React.RefObject<(damage: number) => void>;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  lastBlockPressRef: React.RefObject<number>;
};

export function useBattleSystem(props: Props) {
  const {
    playerX,
    playerY,
    npcX,
    npcY,
    npcLevel,
    npcClass,
    playerState,
    difficulty,
    onPlayerDeath,
    onNpcDeath,
    hitstopRef,
    npcStaggerRef,
    registerHitRef,
    setPlayer,
    lastBlockPressRef,
  } = props;

  const [npcPhase, setNpcPhase] = useState(1);

  // 📊 stats
  const stats = useBattleStats({ npcLevel, npcClass, difficulty, npcPhase });
  const {
    player,
    playerClass,
    char,
    totalArmor,
    totalShield,
    totalVampirism,
    totalReflect,
    titleBonus,
    playerMaxHp,
    npcMaxHp,
    npcArmor,
    critRate,
    HITS_TO_SPECIAL,
    hasPet,
  } = stats;

  const blockLimit = getBlockLimit(char.level, totalArmor);
  const [blockGauge, setBlockGauge] = useState(blockLimit);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockGauge((g) => Math.min(blockLimit, g + 1));
    }, 100);
    return () => clearInterval(interval);
  }, [blockLimit]);

  const behavior = battleBehaviors[player.character] || battleBehaviors.default;

  // 🧠 cooldowns
  const { playerCooldown, npcCooldown, isEnding } = useBattleCooldowns();

  // ✨ efeitos
  const effects = useBattleEffects({ character: player.character });

  // 💥 damage numbers + screen shake
  const { damageNumbers, spawnDamageNumber, clearDamageNumbers } =
    useDamageNumbers();
  const spawnDamageRef = useRef(spawnDamageNumber);
  spawnDamageRef.current = spawnDamageNumber;

  // ❤️ HP state (player + npc)
  const { playerHP, setPlayerHP, npcHP, setNpcHP, playerShield, setPlayerShield } =
    useBattleHP(playerMaxHp, npcMaxHp, totalShield);

  const playerShieldRef = useRef(playerShield);
  playerShieldRef.current = playerShield;

  const damagePlayerHp = (damage: number) => {
    const shield = playerShieldRef.current;
    if (shield >= damage) {
      setPlayerShield((s) => s - damage);
      return;
    }
    setPlayerShield(0);
    const remaining = damage - shield;
    setPlayerHP((hp) => Math.max(0, hp - remaining));
  };

  // 👊 player
  const playerBattle = usePlayerBattle({
    player,
    playerClass,
    char,
    behavior,
    playerX,
    playerY,
    npcX,
    npcY,
    playerState,
    HITS_TO_SPECIAL,
    setNpcHP,
    setPlayerHP,
    playerMaxHp,
    totalVampirism,
    playerCooldown,
    isEnding,
    spawnPiercing: effects.spawnPiercing,
    triggerExplosion: effects.triggerExplosion,
    titleDamageBonus: titleBonus.damage,
    critRate: stats.critRate,
    npcArmor,
    spawnDamageRef,
    hitstopRef,
    registerHitRef,
  });

  // 🤖 npc
  const npcBattle = useNpcBattle({
    npcLevel,
    npcClass,
    playerClass,
    playerX,
    playerY,
    npcX,
    npcY,
    player,
    totalArmor,
    damagePlayerHp,
    setPlayer,
    setNpcHP,
    totalReflect,
    npcCooldown,
    difficulty,
    isEnding,
    spawnDamageRef,
    hitstopRef,
    npcStaggerRef,
    blockGauge,
    setBlockGauge,
    lastBlockPressRef,
  });

  // 🧠 lifecycle
  const { isNpcDying } = useBattleLifecycle({
    playerHP,
    npcHP,
    npcClass,
    npcPhase,
    setNpcPhase,
    setNpcHP,
    npcMaxHp,
    onPlayerDeath,
    onNpcDeath,
    isEnding,
  });

  // 🐐 pet damage
  const petDamageRef = useRef(() => {});
  petDamageRef.current = () => {
    if (isEnding.current) return;
    const dmg = calculateDamageToNpc(8, npcArmor);
    setNpcHP((hp) => Math.max(0, hp - dmg));
    spawnDamageRef.current?.(dmg, npcX, npcY, "pet");
    hitstopRef.current = Date.now() + 40;
  };

  const { pet } = usePetBattle({
    enabled: hasPet,
    playerX,
    playerY,
    npcX,
    npcY,
    isPaused: isEnding.current,
    onPetDamage: () => petDamageRef.current(),
    hitstopRef,
  });

  // 💥 external damage to player (summons, etc.)
  const damagePlayer = (damage: number) => {
    if (player.state === "blocked") {
      if (blockGauge > 0) {
        if (damage <= blockGauge) {
          setBlockGauge((g) => Math.max(0, g - damage));
          spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
          return;
        }
        const remaining = damage - blockGauge;
        setBlockGauge(0);
        damagePlayerHp(remaining);
        setPlayer((p) => ({ ...p, state: "stun" }));
        spawnDamageRef.current?.(remaining, playerX, playerY, "summon");
        return;
      }

      const halved = Math.max(1, Math.round(damage / 2));
      damagePlayerHp(halved);
      spawnDamageRef.current?.(halved, playerX, playerY, "summon");
      return;
    }

    const reduced =
      totalArmor > 0 ? Math.round((damage * 100) / (100 + totalArmor)) : damage;
    damagePlayerHp(reduced);
    spawnDamageRef.current?.(reduced, playerX, playerY, "summon");
  };

  // 🔄 reset
  const resetBattle = () => {
    setPlayerHP(playerMaxHp);
    setPlayerShield(totalShield);
    setBlockGauge(blockLimit);
    setNpcHP(npcMaxHp);
    setNpcPhase(1);
    playerBattle.setDelicia(0);
    playerBattle.setStacks(0);
    effects.resetEffects();
    clearDamageNumbers();
    playerCooldown.current = true;
    npcCooldown.current = true;
    isEnding.current = false;
    behavior.reset?.({
      setStacks: playerBattle.setStacks,
      setDelicia: playerBattle.setDelicia,
    });
  };

  return {
    playerHP,
    setPlayerHP,
    playerMaxHp,
    playerShield,
    npcHP,
    setNpcHP,
    npcMaxHp,
    npcPhase,
    delicia: playerBattle.delicia,
    setDelicia: playerBattle.setDelicia,
    hitsToSpecial: HITS_TO_SPECIAL,
    playerHit: playerBattle.playerHit,
    specialHit: playerBattle.specialHit,
    npcMeleeHit: npcBattle.npcMeleeHit,
    npcRangedHit: npcBattle.npcRangedHit,
    resetBattle,
    damagePlayer,
    isNpcDying,
    playerCooldown,
    isEnding,
    piercings: effects.piercings,
    isExploding: effects.isExploding,
    pet,
    damageNumbers,
    spawnDamageNumber,
    char,
    critRate,
    npcArmor,
    totalVampirism,
    totalReflect,
    titleDamageBonus: titleBonus.damage,
    blockGauge,
    blockLimit,
  };
}
