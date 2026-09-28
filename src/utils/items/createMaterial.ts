import { itemPath } from "@/utils/paths";

type MaterialEntry = {
  name: string;
  description: string;
};

/**
 * Cria uma lista de itens de material da profissão.
 *
 * O `image` é derivado do id da entrada via `itemPath` (mesma pasta dos
 * demais itens),
 * podendo ser ajustado por `toFileName` (ex.: os woods usam o id sem o
 * sufixo `_wood`). O campo `type` é sempre `"material"`.
 */
export function createMaterials<T extends Record<string, MaterialEntry>>(
  folder: string,
  entries: T,
  toFileName: (id: keyof T & string) => string = (id) => id,
) {
  return Object.fromEntries(
    Object.entries(entries).map(([id, entry]) => [
      id,
      {
        id,
        image: itemPath(`${folder}/${toFileName(id as keyof T & string)}.svg`),
        type: "material",
        ...entry,
      },
    ]),
  ) as {
    [K in keyof T]: T[K] & { id: K; image: string; type: "material" };
  };
}
