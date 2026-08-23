import { useRef, useCallback, useEffect } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { PLAYER_CHARGE_DASH_COOLDOWN } from "@/data/cooldowns";
import { isPlayerInRange } from "@/gameRules/battle/range";
import {
  DASH_DURATION,
  DASH_INTERVAL,
  DASH_STEP,
  BATTLE_LIMITS,
} from "@/gameRules/movement/constants";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { combatService } from "@/services/combat";

type Props = {
  player: Player;
  npcX: number;
  npcY: number;
  npcType: string;
  npcArmor: number;
  npcClass: NPCClass;
  char: { level: number; stats: { strength: number } };
  playerClass: PlayerClass;
  critRate: number;
  titleDamageBonus: number;
  elementDamageBonus: number;
  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
  playerCooldown: React.RefObject<boolean>;
  hitstopRef: React.RefObject<number>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  registerHitRef: React.RefObject<(damage: number) => void>;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  setPlayerState: (state: PlayerState) => void;
  summons: SummonedNpc[];
  setSummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;
  setDelicia: React.Dispatch<React.SetStateAction<number>>;
  hitsToSpecial: number;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
};

export function useChargeDash(props: Props) {
  const {
    char,
    playerClass,
    critRate,
    titleDamageBonus,
    elementDamageBonus,
    npcArmor,
    npcClass,
    playerCooldown,
    hitstopRef,
    spawnDamageRef,
    registerHitRef,
    setPlayer,
    setPlayerState,
    setNpcHP,
    hitsToSpecial,
    setSummons,
  } = props;

  const dashIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hitTargetsRef = useRef(new Set<string>());

  const npcXRef = useLatestRef(props.npcX);
  const npcYRef = useLatestRef(props.npcY);
  const npcElementTypesRef = useLatestRef(getNpcElementTypes(props.npcType));
  const summonsRef = useLatestRef(props.summons);
  const setDeliciaRef = useLatestRef(props.setDelicia);
  const setPlayerHPRef = useLatestRef(props.setPlayerHP);
  const playerMaxHpRef = useLatestRef(props.playerMaxHp);
  const playerHpRef = useLatestRef(props.playerHP);
  const dashCharRef = useLatestRef(props.char);
  const vampirismRef = useLatestRef(props.totalVampirism);
  const wasCritRef = useRef(false);

  const cleanup = useCallback(() => {
    if (dashIntervalRef.current) {
      clearInterval(dashIntervalRef.current);
      dashIntervalRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  function execute(player: Player) {
    cleanup();
    hitTargetsRef.current = new Set();

    const dir = player.battleDirection;
    const steps = Math.round(DASH_DURATION / DASH_INTERVAL);
    let stepCount = 0;
    const dashY = player.y;
    const dashCharacter = player.character;

    const buildDashTargets = () => {
      const targets: { id: string; x: number; y: number }[] = [];

      if (npcXRef.current && npcYRef.current) {
        targets.push({
          id: "main",
          x: npcXRef.current,
          y: npcYRef.current,
        });
      }

      for (const summon of summonsRef.current) {
        if (summon.hp > 0 && !summon.isDying) {
          targets.push({ id: summon.id, x: summon.x, y: summon.y });
        }
      }

      return targets;
    };

    const applyDashHit = (
      target: { id: string; x: number; y: number },
      critDmg: number,
      critType: DamageType,
    ) => {
      hitTargetsRef.current.add(target.id);
      setDeliciaRef.current((d) => Math.min(d + 1, hitsToSpecial));

      if (target.id === "main") {
        const elementMultiplier = combatService.getElementMultiplier(
          CHARACTER_ELEMENT_TYPES[dashCharacter],
          npcElementTypesRef.current,
        );
        const dmg = Math.round(
          combatService.calculateDamageToNpc(critDmg, npcArmor) *
            elementMultiplier *
            elementDamageBonus,
        );
        setNpcHP((hp) => Math.max(0, hp - dmg));
        if (vampirismRef.current > 0) {
          const heal = Math.round((dmg * vampirismRef.current) / 100);
          if (heal > 0) {
            setPlayerHPRef.current((hp) =>
              Math.min(playerMaxHpRef.current, hp + heal),
            );
          }
        }
        spawnDamageRef.current?.(
          dmg,
          target.x,
          target.y,
          critType === "crit" ? "crit" : "charge",
        );
        registerHitRef.current?.(dmg);
        hitstopRef.current = Date.now() + 80;
        playerCooldown.current = false;
        setTimeout(() => {
          playerCooldown.current = true;
        }, PLAYER_CHARGE_DASH_COOLDOWN);
      } else {
        const summon = summonsRef.current.find((s) => s.id === target.id);
        const elementMultiplier = combatService.getElementMultiplier(
          CHARACTER_ELEMENT_TYPES[dashCharacter],
          summon ? getNpcElementTypes(summon.npcType) : [],
        );
        const summonDmg = Math.round(
          critDmg * elementMultiplier * elementDamageBonus,
        );
        spawnDamageRef.current?.(
          summonDmg,
          target.x,
          target.y,
          critType === "crit" ? "crit" : "charge",
        );
        registerHitRef.current?.(summonDmg);
        hitstopRef.current = Date.now() + 80;

        if (vampirismRef.current > 0) {
          const heal = Math.round((summonDmg * vampirismRef.current) / 100);
          if (heal > 0) {
            setPlayerHPRef.current((hp) =>
              Math.min(playerMaxHpRef.current, hp + heal),
            );
          }
        }

        setSummons((prev) =>
          prev.map((s) =>
            s.id === target.id
              ? { ...s, hp: Math.max(0, Math.round(s.hp) - summonDmg) }
              : s,
          ),
        );
      }
    };

    setPlayerState("dash");

    dashIntervalRef.current = setInterval(() => {
      stepCount++;

      setPlayer((p) => {
        const step = dir === "left" ? -DASH_STEP : DASH_STEP;
        const newX = Math.max(
          BATTLE_LIMITS.minX,
          Math.min(BATTLE_LIMITS.maxX, p.x + step),
        );

        const rawDmg = combatService.calculatePlayerDamage(
          char.stats.strength,
          playerClass,
          titleDamageBonus,
        );
        const berserkRaw =
          dashCharacter === "samuel" && dashCharRef.current.level >= 20
            ? Math.round(
                rawDmg *
                  combatService.getBerserkMultiplier(
                    playerHpRef.current,
                    playerMaxHpRef.current,
                  ),
              )
            : rawDmg;
        const chargeDmg = Math.round(berserkRaw * 1.5);
        const { damage: critDmg, type: critType } = combatService.rollCrit(
          chargeDmg,
          critRate,
        );
        if (critType === "crit") wasCritRef.current = true;

        const targets = buildDashTargets();

        for (const target of targets) {
          if (hitTargetsRef.current.has(target.id)) continue;

          if (
            isPlayerInRange(
              newX,
              dashY,
              target.x,
              target.y,
              "idle",
              dashCharacter,
              false,
              false,
              target.id === "main" ? npcClass : "common",
            )
          ) {
            applyDashHit(target, critDmg, critType);
          }
        }

        if (
          stepCount >= steps ||
          newX <= BATTLE_LIMITS.minX ||
          newX >= BATTLE_LIMITS.maxX
        ) {
          if (dashIntervalRef.current) {
            clearInterval(dashIntervalRef.current);
            dashIntervalRef.current = null;
          }
          return { ...p, x: newX, state: wasCritRef.current ? "crit" : "idle" };
        }

        return { ...p, x: newX, state: "dash" as const };
      });
    }, DASH_INTERVAL);
  }

  return { execute };
}
