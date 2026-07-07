import type { ComboMove } from "@/utils/types/battle/comboMoves";

const BASE_COMBOS: ComboMove[] = [
  {
    id: "basicAttack",
    name: "Ataque Básico",
    sequence: ["Z"],
    states: ["attack"],
    description: "Ataque rápido com dano moderado.",
    situation: "Use para construir o deliciômetro e manter pressão.",
  },
  {
    id: "specialAttack",
    name: "Ataque Especial",
    sequence: ["G"],
    states: ["preSpecial", "special"],
    description: "Ataque poderoso que consome toda a delícia acumulada.",
    situation: "Use com o deliciômetro cheio para causar dano massivo.",
  },
  {
    id: "fallingAttack",
    name: "Golpe Aéreo",
    sequence: ["Pular", "Z"],
    states: ["jump", "fallingAttack"],
    description: "Golpe ao cair. causa 1.2× de dano.",
    situation: "Use ao cair de um pulo para acertar o inimigo de surpresa.",
  },
  {
    id: "airSpecial",
    name: "Especial Aéreo",
    sequence: ["Pular", "G"],
    states: ["jump", "preSpecialInAir", "specialInAir"],
    description: "Especial executado no ar. causa 1.2× de dano.",
    situation: "Use no ar com deliciômetro cheio.",
  },
  {
    id: "blockAttack",
    name: "Contra-Ataque",
    sequence: ["X", "Z"],
    states: ["blocked", "blockAttack"],
    description: "Ataque rápido saindo da defesa. causa 0.7× de dano e empurra o inimigo.",
    situation: "Use ao bloquear para criar espaço e revidar.",
  },
];

const CHAR_COMBOS: Partial<Record<CharacterId, ComboMove[]>> = {
  larissa: [
    {
      id: "stackExplosion",
      name: "Explosão de Stacks",
      sequence: ["Z (5×)", "G"],
      states: ["attack", "special"],
      description: "Acumule stacks com ataques básicos e consuma tudo com o especial para uma explosão.",
      situation: "Use contra inimigos lentos para maximizar o dano do especial.",
    },
  ],
};

export function getComboMoves(characterId: CharacterId): ComboMove[] {
  return [...BASE_COMBOS, ...(CHAR_COMBOS[characterId] ?? [])];
}
