import { useState, useMemo, useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
import { getEquipmentStatsBonus } from "@/gameRules/battle/equipment";
import { useEquipment } from "@/contexts/EquipmentContext";

import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { getMaxSpecial } from "@/gameRules/battle/special";
import { battleBehaviors } from "@/gameRules/battle/behaviors/player";

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
  } = props;

  const { player, playerClass } = usePlayer();
  const { progress } = useCharacterProgress();
  const { getBonus } = useTitles();

  const baseChar = progress[player.character];
  const behavior = battleBehaviors[player.character] || battleBehaviors.default;
  const [isNpcDying, setNpcDying] = useState(false);

  const { getEquippedItem } = useEquipment();
  const hasPet = getEquippedItem(player.character, "pet") !== null;

  // 🧠 cooldowns
  const { playerCooldown, npcCooldown, isEnding } = useBattleCooldowns();

  // ✨ efeitos
  const effects = useBattleEffects({
    character: player.character
  });

  // 💥 damage numbers + screen shake
  const { damageNumbers, spawnDamageNumber, clearDamageNumbers } = useDamageNumbers();
  const spawnDamageRef = useRef(spawnDamageNumber);
  spawnDamageRef.current = spawnDamageNumber;

  // 📦 equipamento
  const equipmentBonus = useMemo(() => {
    return getEquipmentStatsBonus(player.character);
  }, [player.character]);

  // 🏆 título
  const titleBonus = useMemo(() => {
    return getBonus();
  }, [getBonus]);

  // 🧠 stats do personagem + bônus de equipamento + bônus de título
  const char = useMemo(() => {
    if (!baseChar) return baseChar;
    return {
      ...baseChar,
      stats: {
        hp: baseChar.stats.hp + equipmentBonus.hp + titleBonus.hp,
        strength: baseChar.stats.strength + equipmentBonus.strength + titleBonus.strength,
        intelligence: baseChar.stats.intelligence + equipmentBonus.intelligence + titleBonus.intelligence,
        points: baseChar.stats.points,
      },
    };
  }, [baseChar, equipmentBonus, titleBonus]);

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
  }, [npcLevel, npcClass, difficulty]);

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
    triggerExplosion: effects.triggerExplosion,
    titleDamageBonus: titleBonus.damage,
    spawnDamageRef,
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

    setPlayerHP,
    npcCooldown,
    difficulty,
    isEnding,
    spawnDamageRef,
    hitstopRef,
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

  // 🐐 pet damage
  const petDamageRef = useRef(() => {});
  petDamageRef.current = () => {
    if (isEnding.current) return;
    setNpcHP((hp) => Math.max(0, hp - 8));
    spawnDamageRef.current?.(8, npcX, npcY, "pet");
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
    setPlayerHP(hp => Math.max(0, hp - damage));
    spawnDamageRef.current?.(damage, playerX, playerY, "summon");
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