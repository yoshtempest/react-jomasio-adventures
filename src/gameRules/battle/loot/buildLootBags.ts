import {
  rollLootBagCount,
  rollHyperCoinAmount,
  HYPERCOIN_DROP_CHANCE,
} from "@/data/battle/lootbags";
import type { LootBagContents, BattleLootBag } from "@/utils/types/battle/loot";

type RolledLoot = {
  npcClass: NPCClass;
  coinReward: number;
  itemDrops: ItemDropInfo[];
  equipmentDrops: EquipmentDropInfo[];
  chestDrop: { id: ItemId; name: string } | null;
  keyDrop: { id: ItemId; name: string } | null;
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function distributeRoundRobin<T>(pool: T[], bagCount: number): T[][] {
  const bags: T[][] = Array.from({ length: bagCount }, () => []);
  pool.forEach((item, i) => {
    bags[i % bagCount]!.push(item);
  });
  return bags;
}

/** Constrói as lootbags da batalha a partir dos drops rolados (sem mutar inventário). */
export function buildLootBags(rolled: RolledLoot): LootBagContents[] {
  const { npcClass, coinReward, chestDrop, keyDrop } = rolled;
  const bagCount = rollLootBagCount(npcClass);

  const itemGroups = distributeRoundRobin(shuffle(rolled.itemDrops), bagCount);
  const equipGroups = distributeRoundRobin(
    shuffle(rolled.equipmentDrops),
    bagCount,
  );

  const bags: LootBagContents[] = Array.from({ length: bagCount }, (_, i) => ({
    coins: 0,
    hyperCoins: 0,
    itemDrops: itemGroups[i] ?? [],
    equipmentDrops: equipGroups[i] ?? [],
    chestDrop: null,
    keyDrop: null,
  }));

  const coinsPerBag = Math.floor(coinReward / bagCount);
  let coinRemainder = coinReward - coinsPerBag * bagCount;
  for (const bag of bags) {
    bag.coins = coinsPerBag + (coinRemainder > 0 ? 1 : 0);
    if (coinRemainder > 0) coinRemainder -= 1;
  }

  if (Math.random() < HYPERCOIN_DROP_CHANCE[npcClass]) {
    const target = bags[Math.floor(Math.random() * bagCount)]!;
    target.hyperCoins += rollHyperCoinAmount(npcClass);
  }

  if (chestDrop) {
    const target = bags[Math.floor(Math.random() * bagCount)]!;
    target.chestDrop = chestDrop;
  }

  if (keyDrop) {
    const target = bags[Math.floor(Math.random() * bagCount)]!;
    target.keyDrop = keyDrop;
  }

  return bags;
}

let bagIdCounter = 0;

/** Posiciona as lootbags espalhadas perto do ponto de morte do inimigo. */
export function placeLootBags(
  contents: LootBagContents[],
  spawnX: number,
  spawnY: number,
): BattleLootBag[] {
  const spread = 200;
  return contents.map((bagContents) => {
    bagIdCounter += 1;
    const angle = (bagIdCounter / Math.max(1, contents.length)) * Math.PI * 2;
    const offsetX = Math.round(Math.cos(angle) * spread);
    const offsetY = Math.round(Math.sin(angle) * spread * 0.4);
    const targetX = Math.round(spawnX + offsetX);
    const targetY = spawnY + offsetY;
    return {
      id: bagIdCounter,
      x: targetX,
      y: targetY,
      targetX,
      targetY,
      dropStartX: spawnX,
      dropStartY: spawnY,
      dropStartAt: 0,
      dropDuration: 0,
      contents: bagContents,
      state: "open" as const,
    };
  });
}

/** Agrega todas as lootbags em um RewardInfo para o modal de vitória. */
export function aggregateRewards(
  bags: LootBagContents[],
  xpReward: number,
): RewardInfo {
  const itemDrops: ItemDropInfo[] = [];
  const equipmentDrops: EquipmentDropInfo[] = [];
  let coinReward = 0;

  for (const bag of bags) {
    coinReward += bag.coins;

    for (const drop of bag.itemDrops) {
      const existing = itemDrops.find((d) => d.id === drop.id);
      if (existing) {
        existing.qty += drop.qty;
      } else {
        itemDrops.push({ ...drop });
      }
    }

    for (const drop of bag.equipmentDrops) {
      const existing = equipmentDrops.find(
        (d) => d.id === drop.id && d.enhance === drop.enhance,
      );
      if (existing) continue;
      equipmentDrops.push({ ...drop });
    }
  }

  const chestDrop =
    bags.map((b) => b.chestDrop).find((c) => c !== null) ?? null;
  const keyDrop = bags.map((b) => b.keyDrop).find((k) => k !== null) ?? null;

  return {
    coinReward,
    xpReward,
    equipmentDrops,
    itemDrops,
    chestDrop,
    keyDrop,
  };
}
