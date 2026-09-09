import { ComboDisplay } from "@/components/Game/Battle/Replay/ComboDisplay";
import { ComboAction } from "@/components/Game/Battle/Replay/ComboAction";
import styles from "./styles.module.css";
import { ProjectileConstants } from "@/data/projectile";
import { ReplayNpcSprite } from "@/components/Game/Battle/Replay/NpcSprite";
import { ReplayPlayerSprite } from "@/components/Game/Battle/Replay/PlayerSprite";
import { ReplayDamageNumbers } from "@/components/Game/Battle/Replay/DamageNumbers";
import type { ReplayFrame } from "@/utils/types/replay";
import type { ReplayData } from "@/utils/types/replay";
import { ReplaySummons } from "@/components/Game/Battle/Replay/Summons";
import { ReplayPet } from "@/components/Game/Battle/Replay/Pet";

type Props = {
  replay: ReplayData;
  frame: ReplayFrame;
  layout: { TILE: number; PLAYER: number; sx: number; sy: number };
};

export function ReplayGameLayer({ replay, frame, layout }: Props) {
  return (
    <div
      className={styles.gameLayer}
      style={{
        width: ProjectileConstants.MAP_WIDTH * 0.9,
        height: ProjectileConstants.MAP_HEIGHT,
        transform: `scale(${Math.min(layout.sx, layout.sy)})`,
      }}
    >
      <ReplayNpcSprite
        npcType={replay.npcType}
        frame={frame}
        tileSize={layout.TILE}
      />

      <ReplaySummons summons={frame.sm} tileSize={layout.TILE} />

      <ReplayPet frame={frame} tileSize={layout.TILE} />

      <ReplayPlayerSprite frame={frame} playerSize={layout.PLAYER} />

      <ReplayDamageNumbers
        damage={frame.dmg}
        frame={frame}
        npcType={replay.npcType}
        layout={layout}
      />

      <ComboDisplay
        count={frame.cc}
        rank={frame.cr}
        progress={frame.cprog}
        nextRank={frame.cnext}
      />

      {frame.comboAction && (
        <ComboAction action={frame.comboAction} charId={frame.pchar} />
      )}
    </div>
  );
}
