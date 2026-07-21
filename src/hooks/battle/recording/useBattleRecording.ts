import { useRef, useCallback, useState, useEffect } from "react";
import type {
  ReplayFrame,
  ReplayData,
  PlayerSnap,
  NpcSnap,
  BattleSnap,
  DamageNum,
  SummonSnap,
  PetSnap,
} from "@/utils/types/replay";

type Props = {
  playerRef: React.RefObject<PlayerSnap>;
  npcRef: React.RefObject<NpcSnap>;
  battleRef: React.RefObject<BattleSnap>;
  damageNumbersRef: React.RefObject<DamageNum[]>;
  summonsRef: React.RefObject<SummonSnap[]>;
  petRef: React.RefObject<PetSnap>;
  comboRef: React.RefObject<{
    count: number;
    rank: string;
    progress: number;
    nextRank: string | null;
  }>;
  comboActionRef: React.RefObject<string | null>;
  npcType: string;
  npcLevel: number;
  npcClass: string;
  playerCharacter: string;
  playerLevel: number;
  background: string;
};

export function useBattleRecording({
  playerRef,
  npcRef,
  battleRef,
  damageNumbersRef,
  summonsRef,
  petRef,
  comboRef,
  comboActionRef,
  npcType,
  npcLevel,
  npcClass,
  playerCharacter,
  playerLevel,
  background,
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
      playerLevel,
      background,
      date: new Date().toISOString(),
      duration: 0,
    };
    setIsRecording(true);

    intervalRef.current = setInterval(() => {
      const p = playerRef.current;
      const n = npcRef.current;
      const b = battleRef.current;
      if (!p || !n || !b) return;

      const dmgNums = damageNumbersRef.current ?? [];
      const summons = summonsRef.current ?? [];
      const pet = petRef.current;
      const combo = comboRef.current;
      const comboAction = comboActionRef.current;

      const frame: ReplayFrame = {
        t: Date.now() - startTimestampRef.current,

        px: Math.round(p.x),
        py: Math.round(p.y),
        ps: p.state,
        pd: p.battleDirection,
        pchar: p.character,
        pdir: p.direction,
        php: Math.round(b.playerHP),
        pmaxhp: Math.round(b.playerMaxHp),
        pshield: Math.round(b.playerShield),

        nx: Math.round(n.x),
        ny: Math.round(n.y),
        ns: n.state,
        ndir: n.direction,
        nhp: Math.round(b.npcHP),
        nmaxhp: Math.round(b.npcMaxHp),
        npcPhase: b.npcPhase,

        del: Math.round(b.delicia),
        hits: Math.round(b.hitsToSpecial),
        blockGauge: Math.round(b.blockGauge),
        blockLimit: Math.round(b.blockLimit),

        cc: combo?.count ?? 0,
        cr: combo?.rank ?? "F",
        cprog: combo?.progress ?? 0,
        cnext: combo?.nextRank ?? null,

        dmg: dmgNums.map((d) => ({
          v: d.value,
          x: Math.round(d.x),
          y: Math.round(d.y),
          c: d.type === "crit",
          ty: d.type,
        })),
        sm: summons.map((s) => ({
          id: s.id,
          x: Math.round(s.x),
          y: Math.round(s.y),
          t: s.npcType,
          st: s.state,
          dir: s.direction,
          hp: Math.round(s.hp),
        })),

        petx: pet ? Math.round(pet.x) : null,
        pety: pet ? Math.round(pet.y) : null,
        petst: pet?.state ?? null,
        petdir: pet?.direction ?? null,
        petType: pet?.npcType ?? null,
        petphp: pet ? Math.round(pet.hp) : null,
        petpmaxhp: pet ? Math.round(pet.maxHp) : null,

        comboAction: comboAction,
      };

      framesRef.current.push(frame);
    }, 100);
  }, [
    isRecording,
    npcType,
    npcLevel,
    npcClass,
    playerCharacter,
    playerLevel,
    background,
    playerRef,
    npcRef,
    battleRef,
    damageNumbersRef,
    summonsRef,
    petRef,
    comboRef,
    comboActionRef,
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
