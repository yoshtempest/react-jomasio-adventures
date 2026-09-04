import type {
  ReplayFrame,
  PlayerSnap,
  NpcSnap,
  BattleSnap,
  DamageNum,
  SummonSnap,
  PetSnap,
} from "@/utils/types/replay";
import type { ComboRank } from "@/utils/types/battle/combo";

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

export function buildFrame(snaps: FrameSnapshots, t: number): ReplayFrame {
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