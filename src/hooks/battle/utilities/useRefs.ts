import { useRef } from "react";

import { ProjectileHpConstants } from "@/data/projectile";

import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";
import type { ProjectileHitDamageFn } from "@/utils/types/battle/projectileHit";
import type { TempoEffect } from "@/gameRules/battle/tempo";

export function useBattleRefs() {
  const npcRangedAttackRef = useRef<() => void>(() => {});
  const npcMeleeAttackRef = useRef<() => void>(() => {});
  const npcBurstAttackRef = useRef<(pushDir: number) => void>(() => {});
  const npcThrowAttackRef = useRef<() => void>(() => {});
  const playerYRef = useRef(0);
  /**
   * Efeitos de tempo da batalha (regra `gameRules/battle/tempo`): hitstop,
   * congelamento da Killer Queen, Expansão de Domínio, O Mais Honrado.
   * Substitui os antigos `hitstopRef` + `projectilesFreezeUntilRef`.
   */
  const tempoRef = useRef<TempoEffect[]>([]);
  const npcStaggerRef = useRef(0);
  const spawnDamageRef = useRef<SpawnDamageFn>(() => {});
  const registerHitRef = useRef<(damage: number) => void>(() => {});
  /**
   * Token de "1 instância de dano por golpe" do jogador (básico, special e
   * charge). Vive aqui porque `useNpcAI` (que destrói projéteis) é montado
   * antes do `useBattleSystem`, que é quem consume o token.
   */
  const playerCooldown = useRef(true);
  /**
   * Dano do golpe de ataque ativo do jogador (básico ou special), resolvido
   * pelo mesmo pipeline de `playerHit`/`specialHit`. `useProjectile` consome
   * para que o projétil tome o mesmo dano que o NPC levaria. O default é usado
   * antes do `usePlayer` montar (ex: treino) e quando não há golpe em curso.
   */
  const playerHitDamageRef = useRef<ProjectileHitDamageFn>(() => ({
    damage: ProjectileHpConstants.PLAYER_MELEE_DAMAGE,
    type: "projectile",
  }));

  return {
    npcRangedAttackRef,
    npcMeleeAttackRef,
    npcBurstAttackRef,
    npcThrowAttackRef,
    playerYRef,
    tempoRef,
    npcStaggerRef,
    spawnDamageRef,
    registerHitRef,
    playerCooldown,
    playerHitDamageRef,
  };
}
