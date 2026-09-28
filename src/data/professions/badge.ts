import type { ProfessionId } from "@/utils/types/player/profession";

/**
 *
 * Fonte única do caminho: nem todo `ProfessionId` tem arquivo homônimo
 * (`lumberjack` reaproveita o badge do agricultor, `bodyBuilder` tem
 * capitalização própria no disco), então o caminho nunca pode ser derivado
 * por template a partir do id.
 */
export const PROFESSION_BADGES: Record<ProfessionId, string> = {
  alchemist: "/alchemist.svg",
  farmer: "/farmer.svg",
  fisher: "/fisher.svg",
  butcher: "/butcher.svg",
  lumberjack: "/farmer.svg",
  chef: "/chef.svg",
  bodyBuilder: "/bodyBuilder.svg",
  mechanic: "/mechanic.svg",
  miner: "/miner.svg",
};

export function getProfessionBadge(profession: ProfessionId): string {
  return PROFESSION_BADGES[profession];
}
