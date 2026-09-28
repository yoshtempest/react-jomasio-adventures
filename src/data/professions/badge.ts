import { professionBadgePath } from "@/utils/paths";

import type { ProfessionId } from "@/utils/types/player/profession";

/**
 *
 * Fonte única do caminho: nem todo `ProfessionId` tem arquivo homônimo
 * (`lumberjack` reaproveita o badge do agricultor, `bodyBuilder` tem
 * capitalização própria no disco), então o caminho nunca pode ser derivado
 * por template a partir do id.
 */
export const PROFESSION_BADGES: Record<ProfessionId, string> = {
  alchemist: professionBadgePath("alchemist.svg"),
  farmer: professionBadgePath("farmer.svg"),
  fisher: professionBadgePath("fisher.svg"),
  butcher: professionBadgePath("butcher.svg"),
  lumberjack: professionBadgePath("farmer.svg"),
  chef: professionBadgePath("chef.svg"),
  bodyBuilder: professionBadgePath("bodyBuilder.svg"),
  mechanic: professionBadgePath("mechanic.svg"),
  miner: professionBadgePath("miner.svg"),
};

export function getProfessionBadge(profession: ProfessionId): string {
  return PROFESSION_BADGES[profession];
}
