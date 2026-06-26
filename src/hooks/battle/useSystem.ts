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
import { useDamageNumbers } from "@/hooks/battle/damage/useNumbers";
import { useExternalDamage } from "@/hooks/battle/damage/useExternal";

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
  npcPhaseRef: React.RefObject<number>;
  npcTargetIsPetRef: React.RefObject<boolean>;
  petXRef: React.RefObject<number>;
  petYRef: React.RefObject<number>;
  onBeforeNpcHitRef?: React.RefObject<() => boolean>;
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
    npcPhaseRef,
    npcTargetIsPetRef,
    petXRef,
    petYRef,
    onBeforeNpcHitRef,
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

  // 💥 external damage
  const { damagePlayerHp, damagePlayer } = useExternalDamage({
    playerX,
    playerY,
    player,
    totalArmor,
    blockGauge,
    playerShield,
    setPlayerHP,
    setPlayerShield,
    setBlockGauge,
    setPlayer,
    spawnDamageRef,
  });

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
    playerHP,
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
    setPlayer,
    onBeforeNpcHitRef,
  });

  // 🐐 pet damage + pet AI
  const petDamageRef = useRef(() => {});
  petDamageRef.current = () => {
    if (isEnding.current) return;
    const dmg = calculateDamageToNpc(8, npcArmor);
    setNpcHP((hp) => Math.max(0, hp - dmg));
    spawnDamageRef.current?.(dmg, npcX, npcY, "pet");
    hitstopRef.current = Date.now() + 40;
  };

  const { pet, damagePet, resetPet } = usePetBattle({
    enabled: hasPet,
    playerX,
    playerY,
    npcX,
    npcY,
    isPaused: isEnding.current,
    onPetDamage: () => petDamageRef.current(),
    hitstopRef,
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
    damagePet,
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
    npcTargetIsPetRef,
    petXRef,
    petYRef,
  });

  // 🧠 lifecycle
  const { isNpcDying } = useBattleLifecycle({
    playerHP,
    npcHP,
    npcClass,
    setNpcPhase,
    npcPhaseRef,
    setNpcHP,
    npcMaxHp,
    onPlayerDeath,
    onNpcDeath,
    isEnding,
  });

  // sync pet position into refs whenever pet changes
  // (refs are owned by useScene, shared with useNpcAI)
  useEffect(() => {
    if (pet) {
      petXRef.current = pet.x;
      petYRef.current = pet.y;
    }
  }, [pet?.x, pet?.y, pet, petXRef, petYRef]);

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
    resetPet();
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
    damagePet,
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
