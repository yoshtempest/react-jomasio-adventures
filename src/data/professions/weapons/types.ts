import type { ProfessionId } from "@/utils/types/player/profession";
import type { EquipmentRank } from "@/utils/types/player/equipment";
import type { ElementType } from "@/utils/types/battle/element";
import type { MaterialId } from "@/data/items/crafting";

/**
 * Ranques da arma de profissão, do comum ao lendário.
 * `rank` mapeia para o EquipmentRank existente para integrar com o sistema
 * de drops e cores de raridade já existente no jogo.
 */
export type ProfessionWeaponTierId =
  "comum" | "raro" | "epico" | "boss" | "lendario";

export type ProfessionWeaponTier = {
  id: ProfessionWeaponTierId;
  rank: EquipmentRank;
  label: string;
  /** Bônus % de dano contra NPCs do elemento alvo (0.05 = +5%). */
  damageBonus: number;
  /** Chance % de dropar o material da profissão ao coletar com esta arma. */
  materialDrop: number;
  /** Quantidade do material necessária para subir PARA o próximo ranque. */
  materialQty: number;
};

export type ProfessionWeaponConfig = {
  professionId: ProfessionId;
  /** Nome base da arma (ex: "Vara de Pesca"). */
  baseName: string;
  /** arma base já existente (ranque comum). */
  baseToolId: EquipmentId;
  /** Tipagem inimiga contra a qual a arma causa dano extra. */
  element: ElementType;
  /** Material único de upgrade da profissão. */
  materialId: MaterialId;
  /** Nome do material para exibição. */
  materialName: string;
};
