import type { ReplayData } from "@/utils/types/replay";
import { HudPlayer } from "../HudPlayer";
import { HudNpc } from "../HudNpc";
import { ReplayGameLayer } from "../GameLayer";
import { getReplayLayout } from "@/utils/replay/replayLayout";
import styles from "../styles.module.css";
import type { ReplayFrame } from "@/utils/types/replay";
import { ReplayBackground } from "../Background";

type Props = {
  replay: ReplayData;
  frame: ReplayFrame;
  viewport: ReplayViewportSize;
};

export function ReplayViewport({ replay, frame, viewport }: Props) {
  const layout = getReplayLayout(viewport.width, viewport.height);

  return (
    <div className={styles.vp}>
      <ReplayBackground background={replay.background} />

      <ReplayGameLayer replay={replay} frame={frame} layout={layout} />

      <HudPlayer
        pchar={frame.pchar}
        php={frame.php}
        pmaxhp={frame.pmaxhp}
        pshield={frame.pshield}
        del={frame.del}
        hits={frame.hits}
        blockGauge={frame.blockGauge}
        blockLimit={frame.blockLimit}
      />

      <HudNpc
        npcType={replay.npcType}
        npcLevel={replay.npcLevel}
        nhp={frame.nhp}
        nmaxhp={frame.nmaxhp}
      />
    </div>
  );
}
