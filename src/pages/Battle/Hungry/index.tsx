import { BattleScene } from "@/components/Game/Scenes/Battle";
import NoEnemies from "/assets/songs/NoEnemies.mp3";
import { useNavigate } from "react-router";
// import type { BattleMapConfig } from "@/utils/types/battleMap";

// const map: BattleMapConfig = {
//   obstacles: [
//     { x: 100, y: 660, width: 200, height: 10, type: "wall" },
//     { x: 380, y: 650, width: 80, height: 20, type: "wall" },
//     { x: 550, y: 660, width: 180, height: 10, type: "wall" },
//     { x: 800, y: 640, width: 70, height: 30, type: "wall" },
//   ],
// };

export default function HungryDeathBattle() {
  const navigate = useNavigate();
  return (
    <BattleScene
      npcType="hungryDeath"
      onVictory={() => navigate(-1)}
      victoryDescription="Você derrotou 'Jhow Simar, o Vigia'"
      className="LibraryBattle"
      audioSrc={NoEnemies}
      // map={map}
    />
  );
}