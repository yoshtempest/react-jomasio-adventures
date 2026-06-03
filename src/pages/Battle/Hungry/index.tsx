import { BattleScene } from "@/components/Game/Scenes/Battle";
import NoEnemies from "/assets/songs/NoEnemies.mp3";
import { useNavigate } from "react-router";


export default function HungryDeathBattle() {
  const navigate = useNavigate();
  return (
    <BattleScene
      npcType="hungryDeath"
      onVictory={() => navigate(-1)}
      victoryDescription="Você derrotou 'Jhow Simar, o Vigia'"
      className="LibraryBattle"
      audioSrc={NoEnemies}
    />
  );
}