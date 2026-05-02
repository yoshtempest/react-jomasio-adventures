import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";

import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { isNpcInRange } from "@/gameRules/battle/range";
import { canPlayerHit } from "@/gameRules/battle/combat";
import { getMaxSpecial } from "@/gameRules/battle/special";
import { isDead } from "@/gameRules/battle/death";
import { battleBehaviors } from "@/gameRules/battle/behaviors/player";

type Props = {
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  npcLevel: number;
  npcClass: "common" | "rare" | "boss";
  onPlayerDeath: () => void;
  onNpcDeath: () => void;
  playerState: string;
};

export function useBattleSystem({
  playerX,
  playerY,
  npcX,
  npcY,
  playerState,
  npcLevel,
  npcClass,
  onPlayerDeath,
  onNpcDeath,
}: Props) {
  const { player, playerClass } = usePlayer();
  const [stacks, setStacks] = useState(0);
  const [piercings, setPiercings] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const [isExploding, setIsExploding] = useState(false);
  const behavior = battleBehaviors[player.character] || battleBehaviors.default;
  const { progress } = useCharacterProgress();

  const createRandomOffset = () => {
    const radius = 20; // distância do centro do NPC

    const angle = Math.random() * Math.PI * 2;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const char = progress[player.character];

  const playerMaxHp = useMemo(() => {
    return 90 + char.stats.hp * 10;
  }, [char.stats.hp]);

  const [playerHP, setPlayerHP] = useState(playerMaxHp);

  useEffect(() => {
    setPlayerHP(playerMaxHp);
  }, [playerMaxHp]);

  // npc section

  const npcMaxHp = useMemo(() => {
    return getNpcStats(npcLevel, npcClass).hp;
  }, [npcLevel, npcClass]);

  const [npcHP, setNpcHP] = useState(npcMaxHp);

  useEffect(() => {
    const npc = getNpcStats(npcLevel ?? 1, npcClass ?? "common");
    setNpcHP(npc.hp);
  }, [npcLevel, npcClass]);

  const playerCooldown = useRef(true);
  const npcCooldown = useRef(true);
  const isEnding = useRef(false);
  
  const [delicia, setDelicia] = useState(0);
  const HITS_TO_SPECIAL = getMaxSpecial(playerClass);

  const resetBattle = useCallback(() => {
    const npc = getNpcStats(npcLevel ?? 1, npcClass ?? "common");

    setPlayerHP(playerMaxHp);
    setNpcHP(npc.hp);
    setDelicia(0);
    setStacks(0);

    behavior.reset?.({ setStacks });

    playerCooldown.current = true;
    npcCooldown.current = true;
    isEnding.current = false;
  },
  [
    npcLevel,
    npcClass,
    playerMaxHp,
    behavior
  ]);


  // 👊 PLAYER HIT
  const playerHit = useCallback(() => {
    if (!playerCooldown.current) return;

    if (!canPlayerHit({
      playerX,
      playerY,
      npcX,
      npcY,
      playerState,
      character: player.character,
      direction: player.battleDirection
    })) return;

    behavior.onBasicHit({
      setNpcHP,
      char,
      playerClass,
      setDelicia,
      HITS_TO_SPECIAL,
      stacks,
      setStacks
    });

    if (player.character === "larissa") {
      const offset = createRandomOffset();

      setPiercings((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: offset.x,
          y: offset.y,
        },
      ]);
    }

    playerCooldown.current = false;

    setTimeout(() => {
      playerCooldown.current = true;
    }, 400);
  },
  [
    playerX,
    playerY,
    npcX,
    npcY,
    playerState,
    player.character,
    char.stats.strength,
    playerClass,
    stacks
  ]);

  const specialHit = useCallback(() => {
    if (!playerCooldown.current) return;
    // if (delicia !== HITS_TO_SPECIAL) return;

    if (!canPlayerHit({
      playerX,
      playerY,
      npcX,
      npcY,
      playerState,
      character: player.character,
      direction: player.battleDirection
    })) return;

    behavior.onSpecialHit({
      setNpcHP,
      char,
      playerClass,
      setDelicia,
      stacks,
      setStacks
    });

    if (player.character === "larissa") {
      setIsExploding(true);

      // limpa os piercings
      setPiercings([]);

      // volta ao normal depois de um tempo
      setTimeout(() => {
        setIsExploding(false);
      }, 300);
    }

    // const dmg = calculateSpecialDamage(char.stats.intelligence, playerClass);

    // setNpcHP((hp) => Math.max(0, hp - dmg));
    // setDelicia(0);

    playerCooldown.current = false;

    setTimeout(() => {
      playerCooldown.current = true;
    }, 600);
  },
  [
    playerX,
    playerY,
    npcX,
    npcY,
    playerState,
    player.character,
    delicia,
    HITS_TO_SPECIAL,
    char,
    playerClass,
    stacks
  ]);

  // 🤖 NPC HIT
  const npcHit = useCallback(() => {
    if (!npcCooldown.current) return;
    if (!isNpcInRange(playerX, playerY, npcX, npcY)) return;
    if (player.state === "blocked") return;

    const npc = getNpcStats(npcLevel, npcClass);

    const dmg = calculateNpcDamage(npc.damage, playerClass);

    setPlayerHP((hp) => Math.max(0, hp - dmg));

    npcCooldown.current = false;

    setTimeout(() => {
      npcCooldown.current = true;
    }, 800);
  }, [playerX, playerY, npcX, npcY, npcLevel, npcClass, playerClass]);

  // 🧠 AUTO CHECK (MUITO MELHOR)
  useEffect(() => {
    if (isEnding.current) return;

    if (isDead(playerHP)) {
      isEnding.current = true;

      setTimeout(() => {
        const npc = getNpcStats(npcLevel ?? 1, npcClass ?? "common");

        setPlayerHP(playerMaxHp);
        setNpcHP(npc.hp);
        isEnding.current = false;
        onPlayerDeath();
      }, 500);
      return;
    }

    if (isDead(npcHP)) {
      isEnding.current = true;

      setTimeout(() => {
        onNpcDeath();
      }, 300);
    }
  }, [playerHP, npcHP, onPlayerDeath, onNpcDeath, npcLevel, npcClass, playerMaxHp]);

  return {
    playerHP,
    playerMaxHp,
    npcHP,
    npcMaxHp: getNpcStats(npcLevel, npcClass).hp,
    delicia,
    hitsToSpecial: HITS_TO_SPECIAL,
    
    playerHit,
    specialHit,
    npcHit,
    resetBattle,
    piercings,
    isExploding,
  };
}