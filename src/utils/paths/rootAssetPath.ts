import { asset } from "./asset";

/* -------------------------------------------------------------------------- */
/* Categorias de asset                                                         */
/* -------------------------------------------------------------------------- */

/*
 * Constantes e dados do jogo guardam só o NOME do arquivo
 * (`"miner.svg"`); a pasta mora aqui. Antes cada call site repetia a string
 * "/assets/algumaPasta/" na mão, o que quebrava em silêncio quando a pasta
 * mudava. Invariante: se o dado já chamou uma função daqui, o consumidor
 * usa o valor direto — nunca `asset()` em cima, que prefixaria o BASE_URL
 * duas vezes.
 */

export function rootAssetPath(name: string): string {
  return asset(`/assets/${name}`);
}
