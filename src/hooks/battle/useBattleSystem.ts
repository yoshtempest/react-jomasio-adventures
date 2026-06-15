import { useState, useRef } from "react";
import { calculateDamageToNpc } from "@/gameRules/battle/damage";
import { battleBehaviors } from "@/gameRules/battle/behaviors/player";

import { useBattleStats } from "@/hooks/battle/useBattleStats";
import { useBattleHP } from "@/hooks/battle/useBattleHP";
import { useBattleCooldowns } from "@/hooks/battle/useBattleCooldowns";
import { useBattleEffects } from "@/hooks/battle/useBattleEffects";
import { usePlayerBattle } from "@/hooks/battle/player/usePlayerBattle";
import { useNpcBattle } from "@/hooks/battle/npc/useNpcBattle";
import { useBattleLifecycle } from "@/hooks/battle/useBattleLifecycle";
import { usePetBattle } from "@/hooks/battle/usePetBattle";
import { useDamageNumbers } from "@/hooks/battle/useDamageNumbers";
import type { NpcDifficulty } from "@/utils/types/npc/npcProgress";

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
  } = props;

  const [isNpcDying, setNpcDying] = useState(false);
  const [npcPhase, setNpcPhase] = useState(1);

  // 📊 stats
  const stats = useBattleStats({ npcLevel, npcClass, difficulty, npcPhase });
  const {
    player,
    playerClass,
    char,
    totalArmor,
    titleBonus,
    playerMaxHp,
    npcMaxHp,
    npcArmor,
    HITS_TO_SPECIAL,
    hasPet,
  } = stats;

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
  const { playerHP, setPlayerHP, npcHP, setNpcHP } = useBattleHP(
    playerMaxHp,
    npcMaxHp,
  );

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
    setPlayerHP,
    npcCooldown,
    difficulty,
    isEnding,
    spawnDamageRef,
    hitstopRef,
    npcStaggerRef,
  });

  // 🧠 lifecycle
  useBattleLifecycle({
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
    setNpcDying,
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
    const reduced =
      totalArmor > 0 ? Math.round((damage * 100) / (100 + totalArmor)) : damage;
    setPlayerHP((hp) => Math.max(0, hp - reduced));
    spawnDamageRef.current?.(reduced, playerX, playerY, "summon");
  };

  // 🔄 reset
  const resetBattle = () => {
    setPlayerHP(playerMaxHp);
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
    playerMaxHp,
    npcHP,
    npcMaxHp,
    npcPhase,
    delicia: playerBattle.delicia,
    hitsToSpecial: HITS_TO_SPECIAL,
    playerHit: playerBattle.playerHit,
    specialHit: playerBattle.specialHit,
    npcMeleeHit: npcBattle.npcMeleeHit,
    npcRangedHit: npcBattle.npcRangedHit,
    resetBattle,
    damagePlayer,
    isNpcDying,
    setNpcDying,
    playerCooldown,
    isEnding,
    piercings: effects.piercings,
    isExploding: effects.isExploding,
    pet,
    damageNumbers,
    spawnDamageNumber,
  };
}
