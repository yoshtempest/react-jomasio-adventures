import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useTitles } from "@/contexts/TitleContext";
import { getTotalArmor, getWeaponCritRate } from "@/gameRules/battle/equipment";
import { getLuckBonus } from "@/gameRules/battle/luck";
import { asset } from "@/utils/paths";

export function CharacterStats() {
  const { player } = usePlayer();
  const character = player.character;
  const { progress } = useCharacterProgress();
  const { getTotalBonus } = useEquipment();
  const { getBonus } = useTitles();

  const stats = progress[character]?.stats ?? {
    hp: 1,
    strength: 1,
    intelligence: 1,
    resistance: 1,
    tenacity: 1,
    luck: 1,
    points: 0,
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
  const userTenacity = stats.tenacity + bonus.tenacity;
  const userLuck = (stats.luck ?? 1) + (bonus.luck ?? 0);
  const luckBonus = getLuckBonus(userLuck);
  const weaponCritRate = getWeaponCritRate(character);
  const critRate = 1 + weaponCritRate + luckBonus * 100;
  const missChance =
    (0.005 + (titleBonus.enemyMissChance ?? 0) / 100 + luckBonus) * 100;

  return (
    <div className={`StatusColumn ${styles.container}`}>
      <div className="statusMainContainer">
        <img src={asset("/assets/navbar/status.svg")} />
        <h2 className="StatusTitle">Status</h2>
      </div>
      <div>
        <img src={asset("/assets/status/hp.svg")} />
        <p>HP total: {userHp}</p>
      </div>
      <div>
        <img src={asset("/assets/status/basicDamage.svg")} />
        <p>Dano normal: {userNormalAttackDamage}</p>
      </div>
      <div>
        <img src={asset("/assets/status/specialDamage.svg")} />
        <p>Dano especial: {userSpecialDamage}</p>
      </div>
      <div>
        <img src={asset("/assets/status/armor.svg")} />
        <p>Armadura: {userArmor}</p>
      </div>
      <div>
        <img src={asset("/assets/status/tenacity.svg")} />
        <p>Tenacidade: {userTenacity}%</p>
      </div>
      <div>
        <img src={asset("/assets/status/luckChance.svg")} />
        <p>Sorte: {userLuck}%</p>
      </div>
      <div>
        <img src={asset("/assets/status/critical.svg")} />
        <p>Crítico: {critRate.toFixed(1)}%</p>
      </div>
      <div>
        <img src={asset("/assets/titlesBadges/enemyMissAttacks.svg")} />
        <p>Esquiva: {missChance.toFixed(1)}%</p>
      </div>
      <div>
        <img src={asset("/assets/status/shield.svg")} />
        <p>Escudo: {totalShield}</p>
      </div>
    </div>
  );
}
