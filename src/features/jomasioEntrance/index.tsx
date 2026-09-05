import { useMemo, useRef, useState } from "react";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useProfessionProgress } from "@/contexts/ProfessionProgressContext";
import {
  useHasToolEquipped,
  useEquippedWeaponId,
} from "@/hooks/interaction/useHasToolEquipped";
import { createToolInteraction } from "@/interactions/builder";
import type { ToolDeps } from "@/utils/types/interaction";
import type { InventoryItem } from "@/utils/types/player/inventory";
import type { Character } from "@/utils/types/player/player";
import type {
  ProfessionId,
  ProfessionProficiency,
} from "@/utils/types/player/profession";

import { SceneBase } from "@/components/Game/Scenes/Base";
import Talking from "@/components/Game/Interactions/Talking";

import {
  JOMASIO_ENTRANCE_SCENES,
  jomasioEntranceRocks,
} from "@/scenes/jomasioEntrance";
import { sceneBackgrounds } from "@/data/scene/background";
import { ITEMS } from "@/data/items";
import {
  getOresByRockLevel,
  getLowestOreLevel,
} from "@/data/professions/oreLevels";
import {
  WOOD_LEVELS,
  getWoodLevelByTreeLevel,
} from "@/data/professions/woodLevels";
import { rollWoodGather } from "@/gameRules/professions/wood";
import { rollMineGather } from "@/gameRules/professions/mine";
import { rollProfessionMaterial } from "@/gameRules/professions/weapon";
import { rockGridKey, toRockTiles } from "@/gameRules/movement/rocks";
import { THREE_THOUSAND_MS } from "@/data/ms";
import {
  INTERACTION_LABELS,
  POPUP_MESSAGES,
  TOOL_REQUIRED_MESSAGES,
  gatherResult,
  professionLevelRequired,
} from "@/data/messages";

type Props = {
  sceneId: SceneId;
};

const MINE_COOLDOWN_MS = THREE_THOUSAND_MS;

const ROCK_TILES = toRockTiles(jomasioEntranceRocks);

const ROCK_LABELS = Object.fromEntries(
  jomasioEntranceRocks.map((rock) => [rockGridKey(rock), INTERACTION_LABELS.MINE]),
);

type MineRockDeps = ToolDeps & {
  addItem: (item: InventoryItem) => void;
  character: Character;
  getProficiency: (
    character: Character,
    professionId: ProfessionId,
  ) => ProfessionProficiency;
  addProficiencyXP: (
    character: Character,
    professionId: ProfessionId,
    amount: number,
  ) => void;
  equippedWeaponId: string | null;
};

export function JomasioEntranceScene({ sceneId }: Props) {
  const scene = JOMASIO_ENTRANCE_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();
  const { player } = usePlayer();
  const { getProficiency, addProficiencyXP } = useProfessionProgress();
  const hasToolEquipped = useHasToolEquipped();
  const equippedWeaponId = useEquippedWeaponId();

  const [popup, setPopup] = useState<string | null>(null);
  const lastMineTimeRef = useRef(0);

  const hasQuest = (id: string) => quests.some((q) => q.id === id);

  const interactions = useMemo(() => {
    const mineRock = (rockLevel: number) =>
      createToolInteraction<MineRockDeps>(
        "weapon_pickaxe",
        TOOL_REQUIRED_MESSAGES.PICKAXE,
        (deps) => {
          if (Date.now() - lastMineTimeRef.current < MINE_COOLDOWN_MS) {
            deps.setPopup(POPUP_MESSAGES.ROCK_ON_COOLDOWN);
            return;
          }
          lastMineTimeRef.current = Date.now();

          const { level } = deps.getProficiency(deps.character, "miner");

          const ores = getOresByRockLevel(rockLevel);
          if (ores.length === 0) {
            deps.setPopup(POPUP_MESSAGES.ROCK_WITHOUT_ORE);
            return;
          }

          if (level < rockLevel) {
            deps.setPopup(
              professionLevelRequired(
                "Mineiro",
                rockLevel,
                level,
                "minerar esta rocha",
              ),
            );
            return;
          }

          const result = rollMineGather(rockLevel, level);
          const rolled = result?.items ?? [];

          const material = deps.equippedWeaponId
            ? rollProfessionMaterial(deps.equippedWeaponId)
            : null;
          if (material) rolled.push(material);

          rolled.forEach(({ itemId, qty }) =>
            deps.addItem({ id: itemId, qty }),
          );

          const summary = rolled
            .map(
              ({ itemId, qty }) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`,
            )
            .join(", ");

          const xpGained = result?.xpGained ?? 0;
          deps.setPopup(
            gatherResult(
              "Você minerou a rocha!",
              summary,
              xpGained,
              "Mineiro",
            ),
          );

          if (xpGained > 0) {
            deps.addProficiencyXP(deps.character, "miner", xpGained);
          }
        },
      );

    const chopWood = (treeLevel: number) =>
      createToolInteraction<MineRockDeps>(
        "weapon_axe",
        TOOL_REQUIRED_MESSAGES.AXE,
        (deps) => {
          const { level } = deps.getProficiency(deps.character, "lumberjack");

          const wood = getWoodLevelByTreeLevel(treeLevel);
          if (!wood) {
            deps.setPopup(POPUP_MESSAGES.TREE_WITHOUT_WOOD);
            return;
          }

          if (level < wood.treeLevel) {
            deps.setPopup(
              professionLevelRequired(
                "Lenhador",
                wood.treeLevel,
                level,
                "lenhar esta árvore",
              ),
            );
            return;
          }

          const { items: rolled, xpGained } = rollWoodGather(wood, level);

          const material = deps.equippedWeaponId
            ? rollProfessionMaterial(deps.equippedWeaponId)
            : null;
          if (material) rolled.push(material);

          rolled.forEach(({ itemId, qty }) =>
            deps.addItem({ id: itemId, qty }),
          );

          const summary = rolled
            .map(
              ({ itemId, qty }) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`,
            )
            .join(", ");

          deps.setPopup(
            gatherResult(
              "Você lenhou a árvore!",
              summary,
              xpGained,
              "Lenhador",
            ),
          );

          if (xpGained > 0) {
            deps.addProficiencyXP(deps.character, "lumberjack", xpGained);
          }
        },
      );

    const mineDeps = {
      setPopup,
      addItem,
      hasToolEquipped,
      character: player.character,
      getProficiency,
      addProficiencyXP,
      equippedWeaponId,
    };

    const rockInteractions = Object.fromEntries(
      jomasioEntranceRocks.map((rock) => [
        rockGridKey(rock),
        () => mineRock(getLowestOreLevel())(mineDeps),
      ]),
    );

    return {
      ...rockInteractions,
      "5,7": () =>
        chopWood(WOOD_LEVELS[0]?.treeLevel ?? 0)({
          setPopup,
          addItem,
          hasToolEquipped,
          character: player.character,
          getProficiency,
          addProficiencyXP,
          equippedWeaponId,
        }),
    };
  }, [
    setPopup,
    addItem,
    hasToolEquipped,
    player.character,
    getProficiency,
    addProficiencyXP,
    equippedWeaponId,
  ]);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
    <>
      <SceneBase
        scene={scene}
        background={sceneBackgrounds.JomasioEntrance}
        interactions={interactions}
        interactionLabels={{
          ...ROCK_LABELS,
          "5,7": INTERACTION_LABELS.CHOP,
        }}
        itemPickupTiles={ROCK_TILES}
        popup={popup}
        setPopup={setPopup}
        onFinishExtra={() => ({
          addItem,
          removeItem,
          hasItem,
          hasQuest,
        })}
      />

      {popup && <Talking name="Sistema" message={popup} />}
    </>
  );
}
