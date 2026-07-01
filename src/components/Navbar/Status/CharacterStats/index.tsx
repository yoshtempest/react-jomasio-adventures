import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useTitles } from "@/contexts/TitleContext";
import { getTotalArmor } from "@/gameRules/battle/equipment";

export function CharacterStats() {
  const { player } = usePlayer();
  const character = player.character;
  const { progress } = useCharacterProgress();
  const { getTotalBonus } = useEquipment();
  const { getBonus } = useTitles();

  const stats = progress[character]?.stats ?? {
    hp: 1, strength: 1, intelligence: 1, resistance: 1, points: 0,
  };
  const bonus = getTotalBonus(character);
  const titleBonus = getBonus();

  const totalHp = stats.hp + bonus.hp + titleBonus.hp;
  const totalStrength = stats.strength + bonus.strength + titleBonus.strength;
  const totalIntelligence =
    stats.intelligence + bonus.intelligence + titleBonus.intelligence;

  const userHp = 90 + totalHp * 10;
  const userSpecialDamage = 15 + totalIntelligence * 2;
  const userNormalAttackDamage = 6 + totalStrength;
  const userArmor = getTotalArmor(character, stats.resistance);
  const totalShield = bonus.shield + titleBonus.shield;

  return (
    <div className="StatusColumn">
      <h2 className="StatusTitle">Status</h2>
      <p>HP total: {userHp}</p>
      <p>Dano normal: {userNormalAttackDamage}</p>
      <p>Dano especial: {userSpecialDamage}</p>
      <p>Armadura: {userArmor}</p>
      {totalShield > 0 && <p>Escudo: {totalShield}</p>}
    </div>
  );
}
