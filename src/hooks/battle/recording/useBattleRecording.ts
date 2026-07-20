import { useRef, useCallback, useState, useEffect } from "react";
import type { ReplayFrame, ReplayData } from "@/utils/types/replay";

type PlayerSnapshot = {
  x: number;
  y: number;
  state: string;
  direction: string;
  character: string;
};

type NpcSnapshot = {
  x: number;
  y: number;
  state: string;
};

type BattleSnapshot = {
  playerHP: number;
  playerMaxHp: number;
  npcHP: number;
  npcMaxHp: number;
  delicia: number;
  hitsToSpecial: number;
  comboCount: number;
  comboRank: string;
};

type DamageNum = { value: number; x: number; y: number; type: string };

type SummonSnap = { x: number; y: number; npcType: string; hp: number };

type Props = {
  playerRef: React.RefObject<PlayerSnapshot>;
  npcRef: React.RefObject<NpcSnapshot>;
  battleRef: React.RefObject<BattleSnapshot>;
  damageNumbersRef: React.RefObject<DamageNum[]>;
  summonsRef: React.RefObject<SummonSnap[]>;
  npcType: string;
  npcLevel: number;
  npcClass: string;
  playerCharacter: string;
};

export function useBattleRecording({
  playerRef,
  npcRef,
  battleRef,
  damageNumbersRef,
  summonsRef,
  npcType,
  npcLevel,
  npcClass,
  playerCharacter,
}: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const framesRef = useRef<ReplayFrame[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimestampRef = useRef(0);
  const metadataRef = useRef<Omit<ReplayData, "id" | "frames"> | null>(null);

  const stopRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    if (isRecording) return;
    framesRef.current = [];
    startTimestampRef.current = Date.now();
    metadataRef.current = {
      npcType,
      npcLevel,
      npcClass: npcClass as ReplayData["npcClass"],
      playerCharacter,
      date: new Date().toISOString(),
      duration: 0,
    };
    setIsRecording(true);

    intervalRef.current = setInterval(() => {
      const player = playerRef.current;
      const npc = npcRef.current;
      const battle = battleRef.current;
      if (!player || !npc || !battle) return;

      const dmgNums = damageNumbersRef.current ?? [];
      const summons = summonsRef.current ?? [];

      const frame: ReplayFrame = {
        t: Date.now() - startTimestampRef.current,
        px: Math.round(player.x),
        py: Math.round(player.y),
        ps: player.state,
        pd: player.direction,
        nx: Math.round(npc.x),
        ny: Math.round(npc.y),
        ns: npc.state,
        php: Math.round(battle.playerHP),
        pmaxhp: Math.round(battle.playerMaxHp),
        nhp: Math.round(battle.npcHP),
        nmaxhp: Math.round(battle.npcMaxHp),
        del: Math.round(battle.delicia),
        hits: Math.round(battle.hitsToSpecial),
        cc: Math.round(battle.comboCount),
        cr: battle.comboRank,
        dmg: dmgNums.map((d) => ({
          v: d.value,
          x: Math.round(d.x),
          y: Math.round(d.y),
          c: d.type === "crit",
        })),
        sm: summons.map((s) => ({
          x: Math.round(s.x),
          y: Math.round(s.y),
          t: s.npcType,
          hp: Math.round(s.hp),
        })),
      };

      framesRef.current.push(frame);
    }, 100);
  }, [
    isRecording,
    npcType,
    npcLevel,
    npcClass,
    playerCharacter,
    playerRef,
    npcRef,
    battleRef,
    damageNumbersRef,
    summonsRef,
  ]);

  const getReplayData = useCallback((): ReplayData | null => {
    if (framesRef.current.length === 0) return null;
    const duration = framesRef.current[framesRef.current.length - 1].t;
    return {
      id: `replay_${Date.now()}`,
      ...metadataRef.current!,
      duration,
      frames: framesRef.current,
    };
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    getReplayData,
  };
}
