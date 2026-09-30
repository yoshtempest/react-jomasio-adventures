import { colKey, type CharacterEquipmentData } from "@/data/equipment/storage";
import {
  getProfessionWeaponId,
  type ProfessionWeaponConfig,
  type ProfessionWeaponTierId,
} from "@/data/professions/weapons";
import { addToCollection } from "./addToCollection";
import { getMutableState } from "./getMutableState";

/**
 * Evolui a arma de profissão de `fromTier` para `toTier`, consumindo 1 unidade
 * da arma de ranque inferior (da coleção ou equipada no slot de arma).
 * O material de upgrade NÃO é consumido aqui — fica a cargo do chamador
 * (que lida com o inventário).
 */
export function upgradeProfessionWeapon(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  config: ProfessionWeaponConfig,
  fromTier: ProfessionWeaponTierId,
  toTier: ProfessionWeaponTierId,
): Record<string, CharacterEquipmentData> | null {
  const fromId = getProfessionWeaponId(config, fromTier);
  const toId = getProfessionWeaponId(config, toTier);

  const { next, data, collection } = getMutableState(allData, character);

  const fromKey = colKey(fromId, 0);
  const collectionCount = collection[fromKey] ?? 0;
  const equippedWeapon = data.equipped.weapon;
  const equippedMatches = equippedWeapon && equippedWeapon.id === fromId;

  if (collectionCount < 1 && !equippedMatches) return null;

  const equipped = { ...data.equipped };

  if (collectionCount > 0) {
    const remaining = collectionCount - 1;
    if (remaining > 0) collection[fromKey] = remaining;
    else delete collection[fromKey];
  }
  if (equippedMatches) {
    equipped.weapon = null;
  }

  addToCollection(collection, toId, 0);

  next[character] = { equipped, collection };
  return next;
}
