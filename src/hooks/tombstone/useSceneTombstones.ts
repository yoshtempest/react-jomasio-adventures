import { useCallback, useEffect, useMemo } from "react";
import { useTombstones } from "@/contexts/TombstoneContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useProfessionProgress } from "@/contexts/ProfessionProgressContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useHasToolEquipped } from "@/hooks/interaction/useHasToolEquipped";
import { NPCS } from "@/data/npc/npc";
import { getNpcDisplayName } from "@/data/npc/displayNames";
import {
  rollCraftDrops,
  CRAFT_MATERIALS,
  type MaterialId,
} from "@/data/items/crafting";
import { ITEMS } from "@/data/items";
import { PROFESSIONS } from "@/data/professions";
import { PROFESSION_XP_PER_GATHER } from "@/gameRules/professions/proficiency";

const BUTCHER_TOOL_ID =
  PROFESSIONS.find((profession) => profession.id === "butcher")?.toolId ??
  "weapon_cleaver";

type Params = {
  locationId?: string;
  onMessage?: (message: string) => void;
};

export function useSceneTombstones({ locationId, onMessage }: Params) {
  const { getTombstones, collectTombstone } = useTombstones();
  const { setBlockedTiles, player } = usePlayer();
  const { addItem, hasSpaceFor } = useInventory();
  const { addProficiencyXP } = useProfessionProgress();
  const { playSound } = useSoundEffects();
  const hasToolEquipped = useHasToolEquipped();

  const { active, fading } = useMemo(
    () => (locationId ? getTombstones(locationId) : { active: [], fading: [] }),
    [locationId, getTombstones],
  );

  // lápide é "parede": bloqueia o tile enquanto existir (inclusive no fade)
  const blockedTiles = useMemo(
    () => [...active, ...fading].map((t) => ({ x: t.x, y: t.y })),
    [active, fading],
  );

  useEffect(() => {
    if (!locationId) return;
    setBlockedTiles(blockedTiles);
    return () => setBlockedTiles([]);
  }, [locationId, blockedTiles, setBlockedTiles]);

  const collectAt = useCallback(
    (x: number, y: number): boolean => {
      if (!locationId) return false;

      const tombstone = active.find((t) => t.x === x && t.y === y);
      if (!tombstone) return false;

      const npcType = tombstone.npcType;
      const npcName = getNpcDisplayName(npcType);
      const doubled = hasToolEquipped(BUTCHER_TOOL_ID);

      // "um pouco dos drops do npc": re-rolo da tabela de drops do próprio npc
      const rolled = rollCraftDrops(NPCS[npcType].class, npcType);
      const drops = Object.entries(rolled).map(([itemId, qty]) => ({
        id: itemId as ItemId,
        qty: doubled ? qty * 2 : qty,
      }));

      if (!hasSpaceFor(drops)) {
        onMessage?.("Mochila cheia — libere espaço antes de recolher.");
        return false;
      }

      drops.forEach(({ id, qty }) => addItem({ id, qty }));

      const summary =
        drops
          .map(({ id, qty }) => {
            const name =
              CRAFT_MATERIALS[id as MaterialId]?.name ??
              ITEMS[id]?.name ??
              id;
            return `${name} x${qty}`;
          })
          .join(", ") || "nada aproveitável";

      const toolNote = doubled ? " (Cutelo: drop dobrado)" : "";
      onMessage?.(
        `Você recolheu os restos de ${npcName}: ${summary}.${toolNote}`,
      );

      addProficiencyXP(player.character, "butcher", PROFESSION_XP_PER_GATHER);
      playSound("receivedItem");
      collectTombstone(locationId, tombstone.id);

      return true;
    },
    [
      locationId,
      onMessage,
      active,
      hasToolEquipped,
      addItem,
      hasSpaceFor,
      player.character,
      addProficiencyXP,
      playSound,
      collectTombstone,
    ],
  );

  return {
    tombstones: [...active, ...fading],
    fadingIds: fading.map((t) => t.id),
    collectAt,
  };
}
