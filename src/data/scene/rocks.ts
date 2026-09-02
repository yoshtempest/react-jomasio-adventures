export const ROCK_SIZES = ["small", "medium", "large"] as const;

export type RockSize = (typeof ROCK_SIZES)[number];

export type RockClass = {
  /**
   * Altura da rocha no mapa. Rocha escalável usa essa altura como a altura do
   * jogador quando ele sobe nela; rocha não escalável usa só como referência
   * visual (elevação do sprite).
   */
  height: number;
  /** Escala do sprite em relação ao tile. */
  scale: number;
  /**
   * Se o jogador pode subir na rocha. Só a rocha pequena é escalável: média e
   * grande viram parede no mapa de colisão, mas continuam interagíveis do chão
   * (o jogador minera de fora, não de cima).
   */
  climbable: boolean;
};

/**
 * Classes de rocha do jogo, por tamanho.
 *
 * - pequena: altura 1, o jogador sobe nela e passa a ter altura 1 no mapa;
 * - média: altura 2, parede;
 * - grande: altura 3, parede.
 */
export const ROCK_CLASSES: Record<RockSize, RockClass> = {
  small: { height: 1, scale: 0.7, climbable: true },
  medium: { height: 2, scale: 1.2, climbable: false },
  large: { height: 3, scale: 1.8, climbable: false },
};

export const ROCK_IMAGE = "/assets/map/rock.svg";
