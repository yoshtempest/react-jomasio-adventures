import { useCallback, useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { CHARACTERS } from "@/data/options/characters";
import { getCharacterRace, getRaceLabel } from "@/data/characters/races";
import { RaceTraits } from "@/components/Game/Navbar/shared/RaceTraits";
import { npcPath, playerPath } from "@/utils/paths";
import { getRank, formatRank } from "@/gameRules/rank";
import styles from "./styles.module.css";

const HUNGRY_THRESHOLD = 20;

export function CharacterInfo() {
  const { player, playerClass } = usePlayer();
  const character = player.character;
  const { progress } = useCharacterProgress();
  const { getEquippedItem } = useEquipment();

  const charProgress = progress[player.character];
  const characterData = CHARACTERS.find((c) => c.image === player.character);
  const raceLabel = getRaceLabel(getCharacterRace(character));

  const isHungry = charProgress.hunger <= HUNGRY_THRESHOLD;
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    setShowImage(true);
  }, [isHungry]);

  const handleImageError = useCallback(() => {
    if (isHungry) {
      setShowImage(false);
    }
  }, [isHungry]);

  const petItem = getEquippedItem(character, "pet");
  const petNpcType = petItem?.id.replace("pet_", "");

  return (
    <div className="StatusColumn">
      <div className={styles.imagesRow}>
        {showImage && (
          <img
            src={playerPath(
              isHungry
                ? `/${player.character}/expressions/hungry.svg`
                : `/${player.character}/expressions/default.svg`,
            )}
            className={styles.image}
            onError={handleImageError}
          />
        )}
        {petItem && petNpcType && (
          <img
            src={npcPath(`/${petNpcType}/default.svg`)}
            className={styles.petImage}
          />
        )}
      </div>
      <h2>
        {characterData?.name} - Nv.{charProgress.level}
      </h2>
      <h2 className={styles.rank}>{formatRank(getRank(charProgress.level))}</h2>
      <h2>Classe: {playerClass}</h2>
      <h2>Raça: {raceLabel}</h2>

      {/*
       * `raceLabel` acima é a raça primária (compatibilidade com save antigo e
       * com o resto do menu); o painel abaixo lista todas as raças do
       * mestiço, com traits e despertar já resolvidos para o nível atual.
       */}
      <RaceTraits character={character} level={charProgress.level} />
    </div>
  );
}
