import { useState, useMemo, useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";

import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { getMaxSpecial } from "@/gameRules/battle/special";
import { battleBehaviors } from "@/gameRules/battle/behaviors/player";

import { useBattleCooldowns } from "@/hooks/battle/useBattleCooldowns";
import { useBattleEffects } from "@/hooks/battle/useBattleEffects";
import { usePlayerBattle } from "@/hooks/battle/usePlayerBattle";
import { useNpcBattle } from "@/hooks/battle/useNpcBattle";
import { useBattleLifecycle } from "@/hooks/battle/useBattleLifecycle";
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
  difficulty: NpcDifficulty
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
    onNpcDeath
  } = props;

  const { player, playerClass } = usePlayer();
  const { progress } = useCharacterProgress();

  const char = progress[player.character];
  const behavior = battleBehaviors[player.character] || battleBehaviors.default;
  const [isNpcDying, setNpcDying] = useState(false);

  // 🧠 cooldowns
  const { playerCooldown, npcCooldown, isEnding } = useBattleCooldowns();

  // ✨ efeitos
  const effects = useBattleEffects({
    character: player.character
  });

  // 📊 player HP
  const playerMaxHp = useMemo(() => {
    return 90 + char.stats.hp * 10;
  }, [char.stats.hp]);

  const [playerHP, setPlayerHP] = useState(playerMaxHp);

  useEffect(() => {
    setPlayerHP(playerMaxHp);
  }, [playerMaxHp]);

  // 🤖 npc HP
  const npcMaxHp = useMemo(() => {
    return getNpcStats(npcLevel, npcClass, difficulty).hp;
  }, [npcLevel, npcClass]);

  const [npcHP, setNpcHP] = useState(npcMaxHp);

  useEffect(() => {
    setNpcHP(npcMaxHp);
  }, [npcMaxHp]);

  // 🧠 fase do boss
  const [npcPhase, setNpcPhase] = useState(1);

  // ⚡ special
  const HITS_TO_SPECIAL = getMaxSpecial(playerClass);

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
    triggerExplosion: effects.triggerExplosion
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

    setPlayerHP,
    npcCooldown,
    difficulty,
    isEnding,
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
    setNpcDying
  });

  // 💥 external damage to player (summons, etc.)
  const damagePlayer = (damage: number) => {
    setPlayerHP(hp => Math.max(0, hp - damage));
  };

  // 🔄 reset
  const resetBattle = () => {
    setPlayerHP(playerMaxHp);
    setNpcHP(npcMaxHp);
    setNpcPhase(1);

    playerBattle.setDelicia(0);
    playerBattle.setStacks(0);

    effects.resetEffects();

    playerCooldown.current = true;
    npcCooldown.current = true;
    isEnding.current = false;

    behavior.reset?.({
      setStacks: playerBattle.setStacks
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
    isExploding: effects.isExploding
  };
}