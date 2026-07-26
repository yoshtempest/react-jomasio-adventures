import { ComboDisplay } from "../ComboDisplay";
import { ComboAction } from "../ComboAction";
import styles from "./styles.module.css";
import { ProjectileConstants } from "@/data/projectile";
import { ReplayNpcSprite } from "../NpcSprite";
import { ReplayPlayerSprite } from "../PlayerSprite";
import { ReplayDamageNumbers } from "../DamageNumbers";
import type { ReplayFrame } from "@/utils/types/replay";
import type { ReplayData } from "@/utils/types/replay";
import { ReplaySummons } from "../Summons";
import { ReplayPet } from "../Pet";

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
        width: ProjectileConstants.MAP_WIDTH,
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

      <ReplayDamageNumbers damage={frame.dmg} />

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
