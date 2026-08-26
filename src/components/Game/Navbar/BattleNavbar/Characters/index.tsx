import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useFlags } from "@/contexts/FlagContext";
import { getSelectableCharacters } from "@/gameRules/menu/selectableCharacters";
import {
  circularNext,
  circularPrev,
  gridMove,
} from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { playerPath, asset } from "@/utils/paths";
import { formatRank, getRank } from "@/gameRules/rank";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { ProgressBar } from "@/components/Game/ProgressBar";
import { srcRank } from "@/gameRules/rank";
import { getXPToNextLevel } from "@/utils/character/progress";


export function Characters() {
  const { player, setCharacter } = usePlayer();
  const { progress } = useCharacterProgress();
  const { hasFlag } = useFlags();
  const { playMove, playSelect } = useMenuSFX();
  const listRef = useRef<HTMLDivElement>(null);

  const selectableCharacters = useMemo(
    () =>
      getSelectableCharacters({
        samurionUnlocked: hasFlag("samurionUnlocked"),
        yvelUnlocked: hasFlag("yvelUnlocked"),
        srGuaxinimUnlocked: hasFlag("srGuaxinimUnlocked"),
      }),
    [hasFlag],
  );

  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.max(
      0,
      selectableCharacters.findIndex((c) => c.image === player.character),
    ),
  );

  const selectedIndexRef = useLatestRef(selectedIndex);
  const selectableCharactersRef = useLatestRef(selectableCharacters);
  const playMoveRef = useLatestRef(playMove);
  const playSelectRef = useLatestRef(playSelect);
  const setCharacterRef = useLatestRef(setCharacter);

  useGameControlsLayer(
    {
      onRight: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularNext(prev, selectableCharactersRef.current.length),
        );
      },
      onLeft: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularPrev(prev, selectableCharactersRef.current.length),
        );
      },
      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, 2, "down", selectableCharactersRef.current.length),
        );
      },
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, 2, "up", selectableCharactersRef.current.length),
        );
      },
      onConfirm: () => {
        playSelectRef.current();
        const selected = getSelected(
          selectableCharactersRef.current,
          selectedIndexRef.current,
        );
        setCharacterRef.current(selected.image);
        return true;
      },
      blockGlobalOpen: true,
    },
    [],
  );

  useEffect(() => {
    if (!listRef.current) return;
    const selectedElement = listRef.current.children[selectedIndex] as
      | HTMLElement
      | undefined;
    selectedElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex]);

  return (
    <div
      ref={listRef}
      className={`containerOfNavbar ${styles.charactersContainer}`}
    >
      {selectableCharacters.map((char, index) => {
        const charProgress = progress[char.image];
        const isSelected = index === selectedIndex;
        const xpNeeded = getXPToNextLevel(charProgress.level);
        const inUse = char.image === player.character;

        return (
          <div
            key={char.name}
            className={`${styles.character} ${isSelected ? styles.selected : ""}`}
          >
            {isSelected && <span className={`cursor ${styles.cursor}`}>▼</span>}

            <img
              src={playerPath(`/${char.image}/default.svg`)}
              className={styles.characterImage}
              alt={char.name}
            />
            <div className={styles.flexColumn}>
              <h2 className={styles.text}>
                <span className={styles.levelRow}>
                  {char.name} - Nv.{charProgress?.level ?? 1}
                  {CHARACTER_ELEMENT_TYPES[char.image]?.map((element) => (
                    <img
                      key={element}
                      src={asset(
                        `/assets/badges/elements/${element.toLowerCase()}.svg`,
                      )}
                      alt={element}
                      title={element}
                      className={styles.elementBadge}
                    />
                  ))}
                </span>
              </h2>
              <div className={styles.rankRow}>
                  <img
                    src={asset(`/assets/badges/ranks/${srcRank(getRank(charProgress?.level ?? 1))}`)}
                    className={styles.rankBadge}
                  />

                  <p className={styles.rank}>
                    {formatRank(getRank(charProgress.level))}
                  </p>
                </div>

              <div className={styles.progressContainer}>
                <ProgressBar
                  value={charProgress.xp}
                  max={xpNeeded}
                  animationId={`char-xp-${char.image}`}
                  level={charProgress.level}
                />
              </div>
              <p className={styles.text}>
                {charProgress.xp} / {xpNeeded} XP
              </p>
              {inUse && <p className={styles.inUse}>Em uso</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
