import { useRef } from "react";
import styles from "./styles.module.css";
import { useCharacterMenu } from "@/hooks/menu/useCharacter";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { CharacterCard } from "@/components/Game/Navbar/shared/CharacterCard";

export function Character() {
  const { progress } = useCharacterProgress();
  const listRef = useRef<HTMLDivElement>(null);
  const { characters, selectableCharacters, selectedIndex } = useCharacterMenu(
    true,
    listRef,
  );

  return (
    <div
      ref={listRef}
      className={`containerOfNavbar ${styles.charactersContainer}`}
    >
      {characters.map((char) => {
        const selectableIndex = selectableCharacters.findIndex(
          (c) => c.name === char.name,
        );
        const charProgress = progress[char.image];
        const isSelected = selectableIndex === selectedIndex;

        return (
          <CharacterCard
            key={char.name}
            character={char}
            isSelected={isSelected}
            progress={charProgress}
            showUnlockDate
          />
        );
      })}
    </div>
  );
}
