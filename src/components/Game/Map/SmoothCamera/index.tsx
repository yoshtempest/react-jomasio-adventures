import { useEffect, useState, type ComponentProps } from "react";
import { GameMap } from "@/components/Game/Map/Game";

/** Fracção do delta coberta por frame — quanto maior, mais "seca" a câmera. */
const CAMERA_SMOOTHING = 0.3;
/** Distância abaixo da qual a interpolação trava no alvo (evita loop eterno). */
const CAMERA_SNAP = 0.5;

type Props = Omit<ComponentProps<typeof GameMap>, "cameraX" | "cameraY"> & {
  targetX: number;
  targetY: number;
};

/**
 * Interpola a câmera até o alvo sem re-renderizar a cena.
 *
 * A suavização antes vivia em `useGameLayout`, dentro da `ExploreScene`: o
 * `setState` por frame re-renderizava o mapa inteiro (NPCs, itens, jogador)
 * só para mudar um `transform` CSS. Aqui o estado pertence a este wrapper de
 * uma div — os `children` vêm como prop da cena, que não re-renderiza, então
 * o React derruba a subárvore e o custo por frame é o diff de um único
 * elemento.
 */
export function SmoothCamera({ targetX, targetY, ...mapProps }: Props) {
  const [camera, setCamera] = useState({ x: targetX, y: targetY });

  // `targetX/targetY` estão nas deps de propósito: quando o jogador passa, o
  // alvo muda e o efeito religa a interpolação a partir de onde a câmera está.
  useEffect(() => {
    const dx = Math.abs(camera.x - targetX);
    const dy = Math.abs(camera.y - targetY);
    if (dx < CAMERA_SNAP && dy < CAMERA_SNAP) {
      if (camera.x !== targetX || camera.y !== targetY) {
        setCamera({ x: targetX, y: targetY });
      }
      return;
    }

    const id = requestAnimationFrame(() => {
      setCamera((prev) => {
        const x = prev.x + (targetX - prev.x) * CAMERA_SMOOTHING;
        const y = prev.y + (targetY - prev.y) * CAMERA_SMOOTHING;
        return {
          x: Math.abs(x - targetX) < CAMERA_SNAP ? targetX : x,
          y: Math.abs(y - targetY) < CAMERA_SNAP ? targetY : y,
        };
      });
    });

    return () => cancelAnimationFrame(id);
  }, [camera.x, camera.y, targetX, targetY]);

  return <GameMap {...mapProps} cameraX={camera.x} cameraY={camera.y} />;
}
