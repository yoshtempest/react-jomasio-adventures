import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { usePetProgress } from "@/contexts/PetProgressContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { PETS } from "@/data/equipment/pets";
import type { EquipmentRank } from "@/utils/types/player/equipment";
import {
  PET_STAR_MAX,
  getPetBaseDamage,
  getPetMaxHp,
} from "@/data/characters/petProgress";

export type PetEntry = {
  id: string;
  name: string;
  rank: EquipmentRank;
  owned: boolean;
  qtyByStar: number[];
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
  const { pushControls, popControls } = useGameControls();
  const { getCollection, getEquippedInfo, fusePets } = useEquipment();
  const { getPetProgress, resetPetProgress } = usePetProgress();
  const { playMove, playSelect, playClose } = useMenuSFX();
  const { playSound } = useSoundEffects();

  const collection = getCollection(character);
  const equippedInfo = getEquippedInfo(character, "pet");

  const pets: PetEntry[] = PETS.map((pet) => {
    const qtyByStar: number[] = Array(PET_STAR_MAX).fill(0);
    for (const [key, qty] of Object.entries(collection)) {
      const { id, enhance } = parseCollectionKey(key);
      if (id !== pet.id) continue;
      const star = enhance + 1;
      if (star >= 1 && star <= PET_STAR_MAX) qtyByStar[star - 1] += qty;
    }
    const owned =
      qtyByStar.some((qty) => qty > 0) || equippedInfo?.id === pet.id;
    return { id: pet.id, name: pet.name, rank: pet.rank, owned, qtyByStar };
  });

  const ownedPets = pets.filter((pet) => pet.owned);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);
  const [activeStars, setActiveStars] = useState<Record<string, number>>({});
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

  useEffect(() => {
    if (!listRef?.current) return;
    const selectedElement = listRef.current.children[
      selectedIndex
    ] as HTMLElement | undefined;
    if (!selectedElement) return;
    selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex, listRef]);

  function ownedStars(entry: PetEntry): number[] {
    const stars: number[] = [];
    for (let s = 1; s <= PET_STAR_MAX; s++) {
      if (entry.qtyByStar[s - 1] > 0) stars.push(s);
    }
    return stars;
  }

  function highestEligibleStar(entry: PetEntry): number {
    for (let s = PET_STAR_MAX - 1; s >= 1; s--) {
      if (entry.qtyByStar[s - 1] >= 2) return s;
    }
    return 0;
  }

  function activeStar(entry: PetEntry): number {
    const saved = activeStars[entry.id];
    const owned = ownedStars(entry);
    if (saved && owned.includes(saved)) return saved;
    const eligible = highestEligibleStar(entry);
    if (eligible > 0) return eligible;
    return owned.length > 0 ? owned[owned.length - 1] : 1;
  }

  function cycleStar(direction: 1 | -1) {
    const entry = ownedPets[selectedIndexRef.current];
    if (!entry) return;
    const owned = ownedStars(entry);
    if (owned.length <= 1) return;
    const current = activeStar(entry);
    const index = owned.indexOf(current);
    const next = (index + direction + owned.length) % owned.length;
    playMove();
    setActiveStars((prev) => ({ ...prev, [entry.id]: owned[next] }));
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
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
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
  const activeStarRef = useRef(activeStar);
  activeStarRef.current = activeStar;

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
    const stars = activeStarRef.current(entry);
    if (stars < 1 || stars >= PET_STAR_MAX) return true;

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

  const cycleStarRef = useRef(cycleStar);
  cycleStarRef.current = cycleStar;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : ownedPetsRef.current.length - 1,
        );
      },
      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          prev < ownedPetsRef.current.length - 1 ? prev + 1 : 0,
        );
      },
      onLeft: () => cycleStarRef.current(-1),
      onRight: () => cycleStarRef.current(1),
      onConfirm: () => confirmRef.current(),
      onCancel: () => cancelRef.current(),
      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen]);

  return {
    pets,
    ownedPets,
    equippedId: equippedInfo?.id ?? null,
    selectedIndex,
    pendingStar,
    getProgress: getPetProgress,
    activeStar,
    ownedStars,
    highestEligibleStar,
    statsFor: (entry: PetEntry) => {
      const stars = activeStar(entry);
      const progress = getPetProgress(entry.id, stars);
      return {
        stars,
        level: progress.level,
        maxHp: getPetMaxHp(progress.level, stars),
        damage: getPetBaseDamage(progress.level, stars),
      };
    },
  };
}
