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
import type { ComboRank } from "@/utils/types/battle/combo";
import { initAudioLog, getAudioEvents } from "@/utils/replay/audioEventLog";

type FrameSnapshots = {
  player: PlayerSnap;
  npc: NpcSnap;
  battle: BattleSnap;
  damageNumbers: DamageNum[];
  summons: SummonSnap[];
  pet: PetSnap;
  combo: {
    count: number;
    rank: ComboRank;
    progress: number;
    nextRank: ComboRank | null;
  } | null;
  comboAction: string | null;
};

function buildFrame(snaps: FrameSnapshots, t: number): ReplayFrame {
  const {
    player: p,
    npc: n,
    battle: b,
    damageNumbers: dmgNums,
    summons,
    pet,
    combo,
    comboAction,
  } = snaps;

  return {
    t,

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

    comboAction: comboAction,
  };
}

type Props = {
  playerRef: React.RefObject<PlayerSnap>;
  npcRef: React.RefObject<NpcSnap>;
  battleRef: React.RefObject<BattleSnap>;
  damageNumbersRef: React.RefObject<DamageNum[]>;
  summonsRef: React.RefObject<SummonSnap[]>;
  petRef: React.RefObject<PetSnap>;
  comboRef: React.RefObject<{
    count: number;
    rank: ComboRank;
    progress: number;
    nextRank: ComboRank | null;
  }>;
  comboActionRef: React.RefObject<string | null>;
  npcType: string;
  npcLevel: number;
  npcClass: NPCClass;
  playerCharacter: CharacterId;
  playerLevel: number;
  background: string;
  audioSrc: string;
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
  audioSrc,
}: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const framesRef = useRef<ReplayFrame[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimestampRef = useRef(0);
  const metadataRef = useRef<Omit<
    ReplayData,
    "id" | "frames" | "audioEvents"
  > | null>(null);

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
      npcClass,
      playerCharacter,
      playerLevel,
      background,
      audioSrc,
      date: new Date().toISOString(),
      duration: 0,
    };
    initAudioLog(startTimestampRef.current);
    setIsRecording(true);

    intervalRef.current = setInterval(() => {
      const p = playerRef.current;
      const n = npcRef.current;
      const b = battleRef.current;
      if (!p || !n || !b) return;

      const frame = buildFrame(
        {
          player: p,
          npc: n,
          battle: b,
          damageNumbers: damageNumbersRef.current ?? [],
          summons: summonsRef.current ?? [],
          pet: petRef.current,
          combo: comboRef.current,
          comboAction: comboActionRef.current,
        },
        Date.now() - startTimestampRef.current,
      );

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
    audioSrc,
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
    const duration = framesRef.current[framesRef.current.length - 1]!.t;
    return {
      id: `replay_${Date.now()}`,
      ...metadataRef.current!,
      duration,
      frames: framesRef.current,
      audioEvents: getAudioEvents(),
    };
  }, []);

  const getReplayWindow = useCallback(
    (windowMs: number): ReplayData | null => {
      if (framesRef.current.length === 0 || !metadataRef.current) return null;
      const frames = framesRef.current;
      const last = frames[frames.length - 1]!.t;
      const startT = last - windowMs;
      const windowFrames = frames.filter((f) => f.t >= startT);
      if (windowFrames.length === 0) return null;
      return {
        id: `rewind_${Date.now()}`,
        ...metadataRef.current,
        duration: windowMs,
        frames: windowFrames,
        audioEvents: [],
      };
    },
    [],
  );

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
    getReplayWindow,
  };
}
