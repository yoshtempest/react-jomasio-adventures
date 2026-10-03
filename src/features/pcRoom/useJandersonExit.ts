import { useEffect, useState } from "react";

import { npcPath } from "@/utils/paths";

/**
 * Janderson saindo andando da sala do PC enquanto o jogador escolhe a classe.
 *
 * O passeio é uma lista de poses já resolvidas (sprite + tile + duração) e o
 * hook só anda o índice. Assim o movimento é dado, não código: dá para reler o
 * percurso inteiro sem seguir a máquina de estados, e a pose atual é um index
 * em vez de um monte de estado espalhado.
 */

/** Tempo de cada passo, em ms. */
const STEP_MS = 300;

/**
 * Pausa de quem olha para onde vai antes de sair. É o que dá tempo de tela
 * para os retratos `left` e `up` — sem ela a virada apareceria por um frame só
 * e a sequência `left → movingLeft → up → movingUp` não seria visível.
 */
const TURN_MS = 300;

/** Tile onde ele fica parado na cena. */
const START = { gridX: 9.2, gridY: 7 };

/** Coluna da porta: a única da sala que sobe até o vão do fundo sem parede. */
const CORNER = { gridX: 3.2, gridY: 7 };

/** Tile da porta (`doorTile` da cena, que sai para a Hall). */
const DOOR_TILE = { gridX: 3.2, gridY: 0 };

/** Identidade do NPC, usada como `key` para o React não remontar a cada passo. */
export const JANDERSON_ID = "janderson";

/** Sprite parado — o mesmo que a cena declara para o NPC. */
export const JANDERSON_IDLE_SPRITE = npcPath("/janderson/default.svg");

type JandersonPose = {
  src: string;
  gridX: number;
  gridY: number;
  /** Quanto tempo a pose fica na tela antes do próximo passo. */
  ms: number;
};

/**
 * Pose de espera: o que a cena mostra antes do passeio começar, e o que volta
 * se o modal fechar no meio. `default.svg` é o mesmo desenho de `up.svg`.
 */
const IDLE_POSE: JandersonPose = {
  src: JANDERSON_IDLE_SPRITE,
  gridX: START.gridX,
  gridY: START.gridY,
  ms: 0,
};

function pose(
  sprite: "left" | "movingLeft" | "up" | "movingUp",
  gridX: number,
  gridY: number,
  ms: number,
): JandersonPose {
  return { src: npcPath(`/janderson/${sprite}.svg`), gridX, gridY, ms };
}

/**
 * Percurso: olha para a esquerda, atravessa a sala na direção da coluna da
 * porta e sobe até o vão — `left → movingLeft → up → movingUp`, um tile por
 * passo.
 *
 * O passo é sempre um tile inteiro, então ele sai de 9.2 e para em 3.2, que
 * ainda é a coluna 3 do grid. A parede em (8, 7) é o único obstacle que o
 * percurso atravessa de propósito (é a mesa em que ele estava apoiado); a
 * subida pela coluna 3 é inteiramente livre.
 */
const ROUTE: readonly JandersonPose[] = (() => {
  const poses: JandersonPose[] = [
    pose("left", START.gridX, START.gridY, TURN_MS),
  ];

  const leftSteps = START.gridX - CORNER.gridX;
  for (let step = 1; step <= leftSteps; step++) {
    poses.push(pose("movingLeft", START.gridX - step, START.gridY, STEP_MS));
  }

  poses.push(pose("up", CORNER.gridX, CORNER.gridY, TURN_MS));

  const upSteps = CORNER.gridY - DOOR_TILE.gridY;
  for (let step = 1; step <= upSteps; step++) {
    poses.push(pose("movingUp", CORNER.gridX, CORNER.gridY - step, STEP_MS));
  }

  return poses;
})();

export type JandersonExit = {
  id: string;
  src: string;
  gridX: number;
  gridY: number;
  /** O NPC desliza de um tile ao outro neste intervalo, como o jogador. */
  moveMs: number;
};

/**
 * @param active `true` enquanto o jogador está escolhendo a classe. Fora disso
 * ele fica parado no tile original com o retrato `default`.
 */
export function useJandersonExit(active: boolean): JandersonExit {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Fechar o modal devolve ele ao ponto de partida: o passeio é uma
    // consequência da cutscene, não um estado que persiste na cena.
    if (!active) {
      setStep(0);
      return;
    }

    const current = ROUTE[step];
    if (!current) return;

    const timer = setTimeout(
      () => setStep((prev) => Math.min(prev + 1, ROUTE.length - 1)),
      current.ms,
    );
    return () => clearTimeout(timer);
  }, [active, step]);

  // O `??` cobre o caso em que o índice passa do fim — o timer trava no último
  // índice, mas o `noUncheckedIndexedAccess` exige o guard mesmo assim, e cair
  // na pose parada é o reset coerente.
  const current = (active ? ROUTE[step] : undefined) ?? IDLE_POSE;

  return {
    id: JANDERSON_ID,
    src: current.src,
    gridX: current.gridX,
    gridY: current.gridY,
    moveMs: STEP_MS,
  };
}
