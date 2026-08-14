import { useEffect, useRef, useState } from "react";

import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { PROFESSIONS } from "@/data/professions";
import { ITEMS } from "@/data/items";
import {
  canCraft,
  getMaterialCount,
  getMissingMaterials,
} from "@/gameRules/professions/craft";
import { asset } from "@/utils/paths";
import styles from "./styles.module.css";

export function Professions() {
  const { player } = usePlayer();
  const { addDrop, isOwned, getEquippedItem } = useEquipment();
  const { items, removeItem } = useInventory();
  const { playMove, playSelect, playClose } = useMenuSFX();
  const { pushControls } = useGameControls();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const character = player.character;
  const equippedWeaponId = getEquippedItem(character, "weapon")?.id;

  const selectedIndexRef = useRef(selectedIndex);
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const craftRef = useRef<(index: number) => void>(() => {});
  craftRef.current = (index: number) => {
    const profession = PROFESSIONS[index];
    if (!profession) return;

    if (isOwned(character, profession.toolId)) {
      playClose();
      setMessage("Você já possui essa ferramenta.");
      return;
    }

    const count = (id: string) => getMaterialCount(items, id);

    if (!canCraft(profession.recipe, count)) {
      playClose();
      const missing = getMissingMaterials(profession.recipe, count)
        .map((m) => {
          const def = ITEMS[m.id as keyof typeof ITEMS];
          const name = def ? def.name : m.id;
          return `${name} (${m.owned}/${m.required})`;
        })
        .join(", ");
      setMessage(`Faltam materiais: ${missing}`);
      return;
    }

    for (const [id, qty] of Object.entries(profession.recipe)) {
      for (let i = 0; i < (qty ?? 1); i++) {
        removeItem(id as ItemId);
      }
    }
    addDrop(character, profession.toolId);
    playSelect();
    setMessage(`Ferramenta craftada: ${profession.toolName}`);
  };

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;

  useEffect(() => {
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
        craftRef.current(selectedIndexRef.current);
        return true;
      },
      blockGlobalOpen: true,
    });
    return remove;
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex]);

  return (
    <div className="containerOfNavbar">
      <h3 className={styles.header}>Profissões</h3>
      <ul className={styles.list} ref={listRef}>
        {PROFESSIONS.map((profession, index) => {
          const owned = isOwned(character, profession.toolId);
          const equipped = equippedWeaponId === profession.toolId;
          const count = (id: string) => getMaterialCount(items, id);
          const can = canCraft(profession.recipe, count);
          const isSelected = index === selectedIndex;

          return (
            <li
              key={profession.id}
              className={`${styles.item} ${isSelected ? styles.selected : ""}`}
              onClick={() => craftRef.current(index)}
            >
              <div className={styles.info}>
                <span className={styles.name}>{profession.name}</span>
                <span className={styles.npc}>{profession.npcName}</span>
              </div>

              <div className={styles.tool}>
                <img
                  src={asset("/assets/equipments/weapons.svg")}
                  alt=""
                  className={styles.toolIcon}
                />
                <span>{profession.toolName}</span>
              </div>

              <div className={styles.recipe}>
                {Object.entries(profession.recipe).map(([id, qty]) => {
                  const def = ITEMS[id as keyof typeof ITEMS];
                  const ownedQty = count(id);
                  const enough = ownedQty >= (qty ?? 1);
                  return (
                    <span
                      key={id}
                      className={`${styles.material} ${
                        enough ? styles.have : styles.missing
                      }`}
                    >
                      {def && def.image && (
                        <img
                          src={asset(def.image)}
                          alt=""
                          className={styles.materialIcon}
                        />
                      )}
                      <span>
                        {def ? def.name : id} x{qty}
                        <span className={styles.materialCount}>
                          {" "}
                          ({ownedQty}/{qty})
                        </span>
                      </span>
                    </span>
                  );
                })}
              </div>

              <span
                className={`${styles.status} ${
                  equipped || owned ? styles.statusDone : ""
                } ${!owned && can ? styles.statusReady : ""}`}
              >
                {equipped
                  ? "Equipada"
                  : owned
                    ? "Craftada"
                    : can
                      ? "Craftar"
                      : "Falta material"}
              </span>
            </li>
          );
        })}
      </ul>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
}
