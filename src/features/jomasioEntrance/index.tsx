import { useMemo, useRef, useState } from "react";

import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useProfessionProgress } from "@/contexts/ProfessionProgressContext";
import { useHasToolEquipped } from "@/hooks/interaction/useHasToolEquipped";
import { createToolInteraction } from "@/interactions/builder";
import type { ToolDeps } from "@/utils/types/interaction";
import type { InventoryItem } from "@/utils/types/player/inventory";
import type { Character } from "@/utils/types/player/player";
import type {
  ProfessionId,
  ProfessionProficiency,
} from "@/utils/types/player/profession";

import { SceneBase } from "@/components/Game/Scenes/Base";
import Talking from "@/components/Talking";

import { JOMASIO_ENTRANCE_SCENES } from "@/scenes/jomasioEntrance";
import { sceneBackgrounds } from "@/data/scene/background";
import { ITEMS } from "@/data/items";
import { GATHER_LOOT_TABLES } from "@/data/professions/gathering";
import {
  rollGatherLoot,
  PROFESSION_XP_PER_GATHER,
} from "@/gameRules/professions/proficiency";

type Props = {
  sceneId: SceneId;
};

const MINE_COOLDOWN_MS = 3000;

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
};

export function JomasioEntranceScene({ sceneId }: Props) {
  const scene = JOMASIO_ENTRANCE_SCENES[sceneId];

  const { addItem, removeItem, hasItem } = useInventory();
  const { quests } = useQuests();
  const { player } = usePlayer();
  const { getProficiency, addProficiencyXP } = useProfessionProgress();
  const hasToolEquipped = useHasToolEquipped();

  const [popup, setPopup] = useState<string | null>(null);
  const lastMineTimeRef = useRef(0);

  const hasQuest = (id: string) => quests.some((q) => q.id === id);

  const interactions = useMemo(() => {
    const mineRock = createToolInteraction<MineRockDeps>(
      "weapon_pickaxe",
      "Você precisa equipar uma picareta para minerar.",
      (deps) => {
        if (Date.now() - lastMineTimeRef.current < MINE_COOLDOWN_MS) {
          deps.setPopup("A rocha ainda está se recuperando...");
          return;
        }
        lastMineTimeRef.current = Date.now();

        const { level } = deps.getProficiency(deps.character, "miner");
        const { items: rolled } = rollGatherLoot(
          GATHER_LOOT_TABLES.miner,
          level,
        );

        rolled.forEach(({ itemId, qty }) => deps.addItem({ id: itemId, qty }));

        const summary = rolled
          .map(
            ({ itemId, qty }) =>
              `${ITEMS[itemId as keyof typeof ITEMS]?.name ?? itemId} x${qty}`,
          )
          .join(", ");

        deps.setPopup(`Você minerou a rocha! Obteve: ${summary}`);

        deps.addProficiencyXP(
          deps.character,
          "miner",
          PROFESSION_XP_PER_GATHER,
        );
      },
    );

    return {
      "13,10": () =>
        mineRock({
          setPopup,
          addItem,
          hasToolEquipped,
          character: player.character,
          getProficiency,
          addProficiencyXP,
        }),
    };
  }, [
    setPopup,
    addItem,
    hasToolEquipped,
    player.character,
    getProficiency,
    addProficiencyXP,
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
        interactionLabels={{ "13,10": "[L] Minerar" }}
        itemPickupTiles={[
          {
            x: 13,
            y: 10,
            visible: true,
            image: "/assets/map/rocha.svg",
          },
        ]}
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
