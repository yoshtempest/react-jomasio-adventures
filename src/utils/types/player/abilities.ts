/**
 * Habilidades dos personagens, na visão do menu de Status.
 *
 * Regra:
 * - `kind` discrimina ativa (botão na tela de batalha) de passiva (efeito
 *   automático, sem botão). Toda habilidade é uma das duas.
 * - Um personagem **pode não ter nenhuma habilidade** — o registro de ativas
 *   é `Partial` e as passivas que ainda não foram implementadas são
 *   filtradas, então a lista final é legitimately vazia para alguns
 *   personagens (ver `CHARACTER_ACTIVE_ABILITIES`).
 */

export type ActiveAbility = {
  kind: "active";
  id: string;
  name: string;
  description: string;
  /**
   * Custo por uso em energia (`getEnergyName(character)` — Mana, Energia
   * Amaldiçoada ou Ki). Habilidades de custo variável (instância, Genki Dama,
   * conversão) deixam vazio e explicam a regra na descrição.
   */
  cost?: number;
  cooldownMs?: number;
  /** O botão só passa a existir a partir deste nível. */
  unlockedAtLevel?: number;
  /** O botão só existe enquanto esta condição valer (ex.: Forma Vastolord). */
  requires?: string;
};

export type PassiveAbility = {
  kind: "passive";
  id: string;
  name: string;
  description: string;
  unlockedAtLevel: number;
  oncePerBattle: boolean;
};

export type CharacterAbility = ActiveAbility | PassiveAbility;
