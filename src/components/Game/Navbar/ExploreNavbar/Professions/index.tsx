import { useEffect, useRef, useState } from "react";

import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useProfessionProgress } from "@/contexts/ProfessionProgressContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { PROFESSIONS } from "@/data/professions";
import {
  PROFESSION_WEAPONS,
} from "@/data/professions/weapons";
import { ProfessionItem } from "./ProfessionItem";
import styles from "./styles.module.css";
import { ProfessionDetail } from "./ProfessionDetail";

export function Professions() {
  const { player } = usePlayer();
  const { isOwned, getEquippedItem } = useEquipment();
  const { items } = useInventory();
  const { getProficiency, getXPToNextProfessionLevel } =
    useProfessionProgress();
  const { playMove, playClose } = useMenuSFX();
  const { pushControls } = useGameControls();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openProfession, setOpenProfession] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const character = player.character;
  const equippedWeaponId = getEquippedItem(character, "weapon")?.id;
  const isOwnedAny = (id: EquipmentId) => isOwned(character, id);

  const selectedIndexRef = useRef(selectedIndex);
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const playMoveRef = useLatestRef(playMove);
  const playCloseRef = useLatestRef(playClose);
  const pushControlsRef = useLatestRef(pushControls);

  useEffect(() => {
    if (openProfession !== null) return;
    const remove = pushControlsRef.current({
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex(
          (prev) => (prev - 1 + PROFESSIONS.length) % PROFESSIONS.length,
        );
        return true;
      },
      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => (prev + 1) % PROFESSIONS.length);
        return true;
      },
      onConfirm: () => {
        setOpenProfession(selectedIndexRef.current);
        return true;
      },
      blockGlobalOpen: true,
    });
    return remove;
  }, [playMoveRef, playCloseRef, pushControlsRef, openProfession]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex]);

  if (openProfession !== null) {
    const profession = PROFESSIONS[openProfession];
    const config = profession ? PROFESSION_WEAPONS[profession.id] : undefined;
    if (profession && config) {
      return (
        <div className="containerOfNavbar">
          <ProfessionDetail
            profession={profession}
            config={config}
            items={items}
            onClose={() => setOpenProfession(null)}
          />
        </div>
      );
    }
    setOpenProfession(null);
  }

  return (
    <div className="containerOfNavbar">
      <h3 className={styles.header}>Profissões</h3>
      <ul className={styles.list} ref={listRef}>
        {PROFESSIONS.map((profession, index) => {
          const config = PROFESSION_WEAPONS[profession.id];
          if (!config) return null;
          const proficiencyEntry = getProficiency(character, profession.id);
          const xpToNext = getXPToNextProfessionLevel(proficiencyEntry.level);

          return (
            <ProfessionItem
              key={profession.id}
              profession={profession}
              config={config}
              selected={index === selectedIndex}
              character={character}
              equippedWeaponId={equippedWeaponId}
              isOwnedAny={isOwnedAny}
              proficiency={proficiencyEntry}
              xpToNext={xpToNext}
              items={items}
              onOpen={() => setOpenProfession(index)}
            />
          );
        })}
      </ul>
    </div>
  );
}
