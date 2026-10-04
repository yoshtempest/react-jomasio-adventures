/**
 * Tipagem do dano e da armadura.
 *
 * O jogo separa o dano em três naturezas, e a armadura em duas colunas:
 *
 * - `physical` cai na **armadura física** (corpo a corpo, lâminas, mordidas).
 * - `magical` cai na **armadura mágica** (energia, feitiço, projétil elemental).
 * - `true` (verdadeiro) **ignora qualquer armadura** — é o único jeito de furar
 *   a armadura de um tank. A Expansão de Domínio é o caso canônico.
 *
 * As duas colunas nascem do mesmo stat `armor` do dado: ele é a base das duas,
 * e `physicalArmor`/`magicalArmor` são o excedente de quem blindar só um lado
 * (couro, escudo, barreira arcana).
 *
 * Todo ser em batalha segue a mesma regra — player, NPC principal, summons
 * inimigos, aliados e pets. Um caminho de dano que não passe por
 * `CombatService.applyArmor` é bug.
 */

/** Ordem canônica das naturezas: usada onde é preciso iterar as três. */
export const DAMAGE_KINDS: readonly DamageKind[] = [
  "physical",
  "magical",
  "true",
];

export type DamageKind = "physical" | "magical" | "true";

/** Par de colunas de armadura que defendem um ser em batalha. */
export type DamageArmor = {
  physical: number;
  magical: number;
};
