import type { CharacterId } from "@/data/characters/list";
import { getCharacterPassives } from "@/data/characters/passives";
import {
  EMANUEL_CLONE_MAX_COST,
  EMANUEL_KI_CHARGE_PER_TICK,
  EMANUEL_KI_CHARGE_TICK_MS,
  GENKI_DAMA_INITIAL_COST,
  GENKI_DAMA_MAX_DAMAGE_MULTIPLIER,
} from "@/data/characters/emanuel";
import {
  ATOMIC_COOLDOWN_MS,
  DOMAIN_EXPANSION_COOLDOWN_MS,
} from "@/data/characters/marshadow";
import {
  GRAN_REY_CERO_AOE_RADIUS,
  GRAN_REY_CERO_COOLDOWN_MS,
} from "@/data/characters/granReyCero";
import { LUCAS_WEAPONS } from "@/data/characters/lucasWeapons";
import { LUCAS_WEAPON_SWITCH_MANA_COST } from "@/gameRules/battle/mana";
import {
  BLINK_ENERGY_COST,
  CURSED_ENERGY_HEAL_RATIO,
  DIVERGENT_FIST_COST,
} from "@/gameRules/battle/cursedEnergy";
import type {
  ActiveAbility,
  CharacterAbility,
  PassiveAbility,
} from "@/utils/types/player/abilities";
import type { DamageKind } from "@/utils/types/battle/damageKind";

/**
 * Habilidades ativas por personagem — as que viram botão na tela de batalha.
 *
 * É `Partial` de propósito: personagem sem habilidade ativa é caso legítimo
 * (não tem por que existir uma linha `[]` para cada um dos 12 personagens).
 * Adicionar/remover uma habilidade aqui é a única coisa necessária para a
 * battle e para o menu de Status concordarem sobre o que existe.
 */
export const CHARACTER_ACTIVE_ABILITIES: Partial<
  Record<CharacterId, ActiveAbility[]>
> = {
  lucas: [
    {
      kind: "active",
      id: "weaponSwitch",
      name: "Trocar Arma",
      description: `Troca a arma aleatoriamente entre ${LUCAS_WEAPONS.length} armas, cada uma com seu próprio alcance.`,
      cost: LUCAS_WEAPON_SWITCH_MANA_COST,
    },
  ],
  riquelme: [
    {
      kind: "active",
      id: "divergentFist",
      name: "Punho Divergente",
      description:
        "O próximo golpe passa a ser um soco com 100% de chance de causar 2 instâncias de dano.",
      cost: DIVERGENT_FIST_COST,
    },
    {
      kind: "active",
      id: "blink",
      name: "Blink",
      description: "Teleporte curto à frente.",
      cost: BLINK_ENERGY_COST,
      requires:
        "substitui a conversão de energia enquanto O Abençoado estiver ativo",
    },
    {
      kind: "active",
      id: "cursedEnergyConversion",
      name: "Conversão de Energia",
      description: `Converte energia amaldiçoada em vida (${CURSED_ENERGY_HEAL_RATIO} de energia por 1 de HP).`,
      requires: "some enquanto O Abençoado estiver ativo",
    },
  ],
  emanuel: [
    {
      kind: "active",
      id: "clone",
      name: "Instância",
      description: `Segure para criar a cópia fantasma e mova pela arena; solte para teleportar até ela. O custo é proporcional à distância percorrida, até ${EMANUEL_CLONE_MAX_COST} de Ki.`,
    },
    {
      kind: "active",
      id: "kiCharge",
      name: "Carga de Ki",
      description: `Segure para recarregar +${EMANUEL_KI_CHARGE_PER_TICK} de Ki a cada ${EMANUEL_KI_CHARGE_TICK_MS}ms. O personagem fica parado e não pode agir enquanto segura.`,
    },
    {
      kind: "active",
      id: "genkiDama",
      name: "Genki Dama",
      description: `Segure para flutuar e reunir energia na esfera (cresce a cada segundo); solte para arremessar. Custa ${GENKI_DAMA_INITIAL_COST} de Ki na largada mais dreno contínuo. Dano máximo: ${GENKI_DAMA_MAX_DAMAGE_MULTIPLIER}x o ataque básico.`,
      damageType: "magical",
    },
  ],
  marcelo: [
    {
      kind: "active",
      id: "vastolordLaser",
      name: "Laser Vastolord",
      description:
        "Feixe que cruza o mapa causando dano contínuo e empurrando o inimigo. Só existe na Forma Vastolord, e cada inimigo derrotado na forma rende +1 disparo.",
      requires: "Forma Vastolord ativa",
      damageType: "magical",
    },
    {
      kind: "active",
      id: "iAmAtomic",
      name: "I Am Atomic",
      description:
        "Explosão centrada no inimigo com maior vida máxima, causando dano mágico em todos os inimigos num raio de 300px (2x no alvo).",
      cooldownMs: ATOMIC_COOLDOWN_MS,
      damageType: "magical",
    },
    {
      kind: "active",
      id: "domainExpansion",
      name: "Expansão de Domínio",
      description:
        "Teleporta para a ponta mais próxima do mapa e varre tudo, matando todos os inimigos instantaneamente (100% da vida máxima).",
      cooldownMs: DOMAIN_EXPANSION_COOLDOWN_MS,
      // Sem uso hoje, e é proposital: a Expansão de Domínio é um *execute*
      // (`setNpcHP(0)`), então não existe conta de dano para a armadura
      // reduzir. A declaração existe para fixar a semântica da habilidade caso
      // ela um dia vire dano verdadeiro proporcional — e para deixar explícito
      // que nada aqui deve ser lido como "o Domínio passa pelo funil".
      // Nenhum golpe do jogo usa `"true"` ainda; a mecânica está pronta.
      damageType: "true",
    },
    {
      kind: "active",
      id: "granReyCero",
      name: "Gran Rey Cero",
      description: `Lâmina que percorre grande distância na direção de mira. Ao encostar, para e rasteja, causando dano contínuo e empurrando todo inimigo num raio de ${GRAN_REY_CERO_AOE_RADIUS}px da ponta.`,
      cooldownMs: GRAN_REY_CERO_COOLDOWN_MS,
      damageType: "physical",
    },
  ],
};

function toPassiveAbility(
  passive: ReturnType<typeof getCharacterPassives>[number],
): PassiveAbility {
  return {
    kind: "passive",
    id: passive.id,
    name: passive.name,
    description: passive.description,
    unlockedAtLevel: passive.unlockedAtLevel,
    oncePerBattle: passive.oncePerBattle,
  };
}

/**
 * Lista de habilidades de um personagem: ativas do registro acima + passivas
 * de `CHARACTER_PASSIVES`.
 *
 * Passivas `notImplemented` são omitidas de propósito — é assim que um
 * personagem fica legitimamente sem nenhuma habilidade em vez de exibindo um
 * card "Passiva (a definir)".
 */
export function getCharacterAbilities(
  characterId: CharacterId,
): CharacterAbility[] {
  const passives = getCharacterPassives(characterId)
    .filter((passive) => passive.effect.kind !== "notImplemented")
    .map(toPassiveAbility);

  return [...passives, ...(CHARACTER_ACTIVE_ABILITIES[characterId] ?? [])];
}

/**
 * Índice `abilityId -> natureza do dano`, achatado a partir do registro acima.
 *
 * Existe para os hooks de habilidade lerem a mesma verdade que o menu de Status
 * exibe: um golpe que "deveria" ser mágico e sai físico é bug de dado, não de
 * hook. Ausente no índice = físico, o caso do ataque básico.
 */
const ABILITY_DAMAGE_TYPES: Record<string, DamageKind> = Object.fromEntries(
  Object.values(CHARACTER_ACTIVE_ABILITIES).flatMap((abilities) =>
    (abilities ?? [])
      .filter((ability) => ability.damageType !== undefined)
      .map((ability) => [ability.id, ability.damageType as DamageKind]),
  ),
);

export function getAbilityDamageType(abilityId: string): DamageKind {
  return ABILITY_DAMAGE_TYPES[abilityId] ?? "physical";
}
