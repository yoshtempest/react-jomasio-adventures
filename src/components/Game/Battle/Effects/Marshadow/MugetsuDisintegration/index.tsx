import {
  type MugetsuDisintegrationTarget,
  type MugetsuSweep,
} from "@/hooks/battle/player/characters/marshadow/useDomainExpansion";
import { MugetsuTargetDisintegration } from "./MugetsuTargetDisintegration";


type Props = {
  targets: MugetsuDisintegrationTarget[];
  /** Varredura ativa (null após chegar na ponta — todo alvo já coberto). */
  sweep: MugetsuSweep | null;
  TILE_SIZE: number;
};

/**
 * Camada visual da desintegração da Expansão de Domínio: todos os alvos
 * tocados (NPC principal + summons) viram pixels pretos → pó assoprado.
 */
export function MugetsuDisintegration({ targets, sweep, TILE_SIZE }: Props) {
  if (targets.length === 0) return null;

  return (
    <>
      {targets.map((target) => (
        <MugetsuTargetDisintegration
          key={target.id}
          target={target}
          sweep={sweep}
          TILE_SIZE={TILE_SIZE}
        />
      ))}
    </>
  );
}