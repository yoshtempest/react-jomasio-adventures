import { getChaseMovement } from "@/gameRules/movement/npc";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function slimitaBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    npcPhase,
    onMeleeHit,
  } = ctx;

  const now = Date.now();

  if (!npc.ai) npc.ai = {};

  if (!npc.ai.slimita) {
    npc.ai.slimita = {
      state: "idle",
      startTime: now,
      baseY: npc.y,
      targetX: playerX,
    };
  }

  const state = npc.ai.slimita;


  const dx = npc.x - playerX;
  const dy = npc.y - playerY;
  const distance = Math.hypot(dx, dy);

  // 🟢 FASE 1 (normal)
  if (npcPhase === 1) {
    npc.state = "walk";

    const { x, y } = getChaseMovement(
      npc.x,
      npc.y,
      playerX,
      playerY
    );

    if (distance < 50) {
      onMeleeHit();
    }

    return { x, y };
  }

  // 🔥 FASE 2

  switch (state.state) {
    case "idle": {
      npc.state = "walk";

    const { x, y } = getChaseMovement(
      npc.x,
      npc.y,
      playerX,
      playerY
    );

      if (distance < 9999) {
        state.state = "air";
        state.startTime = now;
        state.baseY = npc.y;
        state.targetX = playerX;

        npc.state = "jumping";
      }

      return { x, y };
    }

    case "air": {
      npc.state = "jumping";

      const elapsed = now - state.startTime;
      const duration = 2000;

      const progress = Math.min(elapsed / duration, 1);

      // altura (parábola)
      const height = Math.sin(progress * Math.PI) * 200;
      const newY = (state.baseY - height);

      // 👉 movimento horizontal durante o pulo
      const newX =
        npc.x + (state.targetX - npc.x) * 0.05;

      // terminou o pulo
      if (elapsed >= duration) {
        state.state = "resting";
        state.startTime = now;

        if (distance < 140) {
          onMeleeHit();
        }

        return {
          x: state.targetX,
          y: state.baseY,
        };
      }

      return {
        x: newX,
        y: newY,
      };
    }

    case "resting": {
      npc.state = "idle";

      const restTime = now - state.startTime;

      if (restTime < 500) {
        return { x: npc.x, y: npc.y };
      }

      state.state = "idle";
      state.startTime = now;

      return { x: npc.x, y: npc.y };
    }
  }
}