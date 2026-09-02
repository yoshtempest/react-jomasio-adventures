import {
  ROCK_CLASSES,
  ROCK_IMAGE,
  type RockSize,
} from "@/data/scene/rocks";
import type { ItemPickupTile } from "@/utils/types/maps/exploreScene";

export type SceneRock = {
  x: number;
  y: number;
  size: RockSize;
};

const WALL_TILE = 1;

/**
 * Devolve o mapa de colisão com as rochas não escaláveis viradas parede.
 *
 * Rocha pequena não entra aqui: ela continua andável para o jogador poder
 * subir nela, e a altura no heightMap é que impede/permite o passo.
 */
export function applyRocksToMap(
  map: number[][],
  rocks: SceneRock[],
): number[][] {
  const patched = map.map((row) => [...row]);

  for (const rock of rocks) {
    if (ROCK_CLASSES[rock.size].climbable) continue;
    const row = patched[rock.y];
    if (!row || row[rock.x] === undefined) continue;
    row[rock.x] = WALL_TILE;
  }

  return patched;
}

/**
 * Constrói o heightMap da cena a partir das rochas escaláveis.
 *
 * Cada rocha escalável eleva o tile dela para a altura da própria classe, o
 * que faz `canStepTo` liberar o passo (diferença de 1) e `getTileHeight`
 * atualizar a altura do jogador quando ele sobe.
 */
export function buildRockHeightMap(
  map: number[][],
  rocks: SceneRock[],
): number[][] {
  const heightMap = map.map((row) => row.map(() => 0));

  for (const rock of rocks) {
    const rockClass = ROCK_CLASSES[rock.size];
    if (!rockClass.climbable) continue;
    const row = heightMap[rock.y];
    if (!row || row[rock.x] === undefined) continue;
    row[rock.x] = rockClass.height;
  }

  return heightMap;
}

/**
 * Converte as rochas da cena nos tiles de sprite que a ExploreScene desenha.
 *
 * A escala e a elevação do sprite saem da classe da rocha, então o tamanho
 * visual acompanha o tamanho de gameplay sem duplicar número na cena.
 */
export function toRockTiles(rocks: SceneRock[]): ItemPickupTile[] {
  return rocks.map((rock) => {
    const rockClass = ROCK_CLASSES[rock.size];
    return {
      x: rock.x,
      y: rock.y,
      visible: true,
      image: ROCK_IMAGE,
      size: rockClass.scale,
      height: rockClass.height,
    };
  });
}

/** Chave de grid (`"x,y"`) usada pelo mapa de interações da cena. */
export function rockGridKey(rock: SceneRock): string {
  return `${rock.x},${rock.y}`;
}
