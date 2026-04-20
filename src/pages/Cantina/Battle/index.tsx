import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "@/assets/songs/StreetFighter5KenTheme.m4a";
import styles from "./styles.module.css";

export default function CantinaBattle() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="jhowsimar"
      redirectTo="/cantina/three"
      victoryDescription="Você derrotou 'Jhow Simar, o Vigia'"
      className={styles.image}
      audioSrc={KenTheme}
    />
  );
}