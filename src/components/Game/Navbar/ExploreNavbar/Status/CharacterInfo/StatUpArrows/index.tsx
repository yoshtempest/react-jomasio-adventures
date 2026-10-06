import { useEffect, useRef, useState } from "react";

import { ArrowUp } from "lucide-react";

import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";

import styles from "./styles.module.css";

type Arrow = {
  key: number;
  /** Posição horizontal (%) do painel: as setas ficam sobre o retrato. */
  left: number;
  delay: number;
  duration: number;
  scale: number;
};

const ARROW_COUNT = 7;
const LEFT_START = 1;
const LEFT_SPAN = 70;

function makeArrows(): Arrow[] {
  const arrows: Arrow[] = [];
  for (let i = 0; i < ARROW_COUNT; i++) {
    arrows.push({
      key: i,
      left: LEFT_START + (i / ARROW_COUNT) * LEFT_SPAN + Math.random() * 5,
      delay: i * 0.07 + Math.random() * 0.1,
      duration: 1.1 + Math.random() * 0.5,
      scale: 0.7 + Math.random() * 0.7,
    });
  }
  return arrows;
}

/**
 * Setas (`ArrowUp` do Lucide) subindo sobre o retrato do personagem quando o
 * jogador investe um ponto disponível em algum status.
 *
 * O gasto é observado pela queda de `stats.points` — `addStat` é o único lugar
 * do jogo que decrementa esse contador (o level up só soma), então a comparação
 * com a referência anterior distingue investir ponto de qualquer outra mudança
 * de progresso. Mesmo padrão de detecção do `LevelUpParticles`.
 */
export function StatUpArrows() {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const character = player.character;
  const stats = progress[character]?.stats;

  // O contador anterior precisa do personagem a que pertence: trocar de
  // personagem troca os pontos sem que nenhum tenha sido gasto.
  const prevRef = useRef({ character, points: stats?.points ?? 0 });
  const arrowsRef = useRef<Arrow[]>([]);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    const prev = prevRef.current;
    const points = stats?.points ?? prev.points;
    const spent = character === prev.character && points < prev.points;

    // Reancora sempre — inclusive na troca de personagem, que só reconstrói a
    // referência sem disparar nada.
    prevRef.current = { character, points };

    if (!spent) {
      // As setas do personagem anterior não podem sobrar no retrato novo.
      if (character !== prev.character) {
        arrowsRef.current = [];
        setBurstKey(0);
      }
      return;
    }

    arrowsRef.current = makeArrows();
    setBurstKey((key) => key + 1);
  }, [character, stats]);

  if (burstKey === 0) return null;

  return (
    <div key={burstKey} className={styles.arrows} aria-hidden="true">
      {arrowsRef.current.map((arrow) => {
        const arrowStyle = {
          left: `${arrow.left}%`,
          animationDelay: `${arrow.delay}s`,
          animationDuration: `${arrow.duration}s`,
          "--arrow-scale": arrow.scale,
        } as React.CSSProperties & { "--arrow-scale": number };
        return (
          <span key={arrow.key} className={styles.arrow} style={arrowStyle}>
            <ArrowUp />
          </span>
        );
      })}
    </div>
  );
}
