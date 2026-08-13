import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { usePetProgress } from "@/contexts/PetProgressContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { PETS } from "@/data/equipment/pets";
import { PET_DROPS } from "@/data/characters/petDrops";
import {
  getPetSkillDefinition,
  getPetRole,
  type PetRole,
} from "@/data/characters/petSkills";
import type { EquipmentRank } from "@/utils/types/player/equipment";
import { PET_STAR_MAX } from "@/data/characters/petProgress";
import {
  circularNext,
  circularPrev,
  gridMove,
} from "@/gameRules/menu/navigation";

export type PetEntry = {
  id: string;
  name: string;
  rank: EquipmentRank;
  role: PetRole;
  skillName: string;
  passiveName: string;
  owned: boolean;
  qtyByStar: number[];
  dropNpc: string | null;
  dropLabel: string | null;
  dropChance: number | null;
};

function parseCollectionKey(key: string): { id: string; enhance: number } {
  const i = key.lastIndexOf("+");
  if (i > 0) {
    const enhance = parseInt(key.slice(i + 1), 10);
    if (!isNaN(enhance)) return { id: key.slice(0, i), enhance };
  }
  return { id: key, enhance: 0 };
}

export function usePetsMenu(
  isOpen: boolean,
  listRef?: React.RefObject<HTMLDivElement | null>,
) {
  const { player } = usePlayer();
  const character = player.character;
  const { pushControls } = useGameControls();
  const { getCollection, getEquippedInfo, fusePets } = useEquipment();
  const { getPetProgress, resetPetProgress } = usePetProgress();
  const { playMove, playSelect, playClose } = useMenuSFX();
  const { playSound } = useSoundEffects();

  const collection = getCollection(character);
  const equippedInfo = getEquippedInfo(character, "pet");

  const pets: PetEntry[] = PETS.map((pet) => {
    const dropInfo = PET_DROPS[pet.id];
    const skillDef = getPetSkillDefinition(pet.id);
    const qtyByStar: number[] = Array(PET_STAR_MAX).fill(0);
    for (const [key, qty] of Object.entries(collection)) {
      const { id, enhance } = parseCollectionKey(key);
      if (id !== pet.id) continue;
      const star = enhance + 1;
      if (star >= 1 && star <= PET_STAR_MAX) qtyByStar[star - 1] += qty;
    }
    const owned =
      qtyByStar.some((qty) => qty > 0) || equippedInfo?.id === pet.id;
    return {
      id: pet.id,
      name: pet.name,
      rank: pet.rank,
      role: getPetRole(pet.id),
      skillName: skillDef?.skill.name ?? "—",
      passiveName: skillDef?.passive.name ?? "—",
      owned,
      qtyByStar,
      dropNpc: dropInfo?.npcType ?? null,
      dropLabel: dropInfo?.npcLabel ?? null,
      dropChance: dropInfo?.chance ?? null,
    };
  });

  const ownedPets = pets.filter((pet) => pet.owned);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);
  const [pendingStar, setPendingStar] = useState(0);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    setPendingStar(0);
  }, [selectedIndex, ownedPets.length]);

  useEffect(() => {
    setSelectedIndex((prev) => {
      if (ownedPets.length === 0) return 0;
      return Math.min(prev, ownedPets.length - 1);
    });
  }, [ownedPets.length]);

  const prevSelectedIndexRef = useRef(selectedIndex);
  useEffect(() => {
    if (!isOpen || !listRef?.current) return;
    const prev = prevSelectedIndexRef.current;
    prevSelectedIndexRef.current = selectedIndex;
    if (selectedIndex === prev) return;
    const container = listRef.current;
    const selectedOwned = ownedPets[selectedIndex];
    if (!selectedOwned) return;
    const petsIndex = pets.findIndex((pet) => pet.id === selectedOwned.id);
    const selectedElement = container.children[petsIndex] as
      | HTMLElement
      | undefined;
    if (!selectedElement) return;
    selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isOpen, selectedIndex, ownedPets, pets, listRef]);

  function maxOwnedStar(entry: PetEntry): number {
    for (let s = PET_STAR_MAX; s >= 1; s--) {
      if (entry.qtyByStar[s - 1] > 0) return s;
    }
    return 0;
  }

  function highestEligibleStar(entry: PetEntry): number {
    for (let s = PET_STAR_MAX - 1; s >= 1; s--) {
      if (entry.qtyByStar[s - 1] >= 2) return s;
    }
    return 0;
  }

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const playCloseRef = useRef(playClose);
  playCloseRef.current = playClose;
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const fusePetsRef = useRef(fusePets);
  fusePetsRef.current = fusePets;
  const resetPetProgressRef = useRef(resetPetProgress);
  resetPetProgressRef.current = resetPetProgress;
  const characterRef = useRef(character);
  characterRef.current = character;
  const ownedPetsRef = useRef(ownedPets);
  ownedPetsRef.current = ownedPets;
  const pendingStarRef = useRef(pendingStar);
  pendingStarRef.current = pendingStar;
  const highestEligibleStarRef = useRef(highestEligibleStar);
  highestEligibleStarRef.current = highestEligibleStar;

  function executeFuse(entry: PetEntry, stars: number) {
    const ok = fusePetsRef.current(characterRef.current, entry.id, stars);
    if (!ok) {
      playCloseRef.current();
      return;
    }
    resetPetProgressRef.current(entry.id, stars + 1);
    playSoundRef.current("receivedItem");
    playSelectRef.current();
  }

  const confirmRef = useRef<() => boolean>(() => false);
  confirmRef.current = () => {
    const entry = ownedPetsRef.current[selectedIndexRef.current];
    if (!entry) return true;
    const stars = highestEligibleStarRef.current(entry);
    if (stars < 1) return true;

    if (pendingStarRef.current !== 0) {
      executeFuse(entry, stars);
      setPendingStar(0);
      return true;
    }

    setPendingStar(stars);
    playSelectRef.current();
    return true;
  };

  const cancelRef = useRef<() => boolean>(() => false);
  cancelRef.current = () => {
    if (pendingStarRef.current !== 0) {
      setPendingStar(0);
      playCloseRef.current();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onRight: () => {
        if (ownedPetsRef.current.length === 0) return;
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularNext(prev, ownedPetsRef.current.length),
        );
      },
      onLeft: () => {
        if (ownedPetsRef.current.length === 0) return;
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularPrev(prev, ownedPetsRef.current.length),
        );
      },
      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, 2, "down", ownedPetsRef.current.length),
        );
      },
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, 2, "up", ownedPetsRef.current.length),
        );
      },
      onConfirm: () => confirmRef.current(),
      onCancel: () => cancelRef.current(),
      blockGlobalOpen: true,
    };

    const remove = pushControlsRef.current(controls);
    return () => remove();
  }, [isOpen]);

  return {
    pets,
    ownedPets,
    equippedId: equippedInfo?.id ?? null,
    selectedIndex,
    pendingStar,
    maxOwnedStar,
    highestEligibleStar,
    statsFor: (entry: PetEntry) => {
      const stars = maxOwnedStar(entry);
      if (stars < 1) return null;
      const progress = getPetProgress(entry.id, stars);
      return {
        stars,
        level: progress.level,
      };
    },
  };
}
