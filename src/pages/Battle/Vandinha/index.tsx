import { BattleScene } from "@/components/Game/Scenes/Battle";
import Jojo from "/assets/songs/Jojo.m4a";
import { useNavigate } from "react-router";
// import type { BattleMapConfig } from "@/utils/types/battleMap";

// const map: BattleMapConfig = {
//   obstacles: [
//     { x: 200, y: 500, width: 80, height: 50, type: "wall" },
//     { x: 350, y: 550, width: 80, height: 80, type: "wall" },
//     { x: 550, y: 500, width: 100, height: 70, type: "wall" },
//     { x: 750, y: 580, width: 70, height: 90, type: "wall" },
//   ],
// };

export default function VandinhaFragmentBattle() {
  const navigate = useNavigate();
  return (
    <BattleScene
      npcType="vandinhaFragment"
      onVictory={() => navigate(-1)}
      className="PcRoomBattle"
      victoryDescription="Você derrotou um fragmento de Vandinha"
      audioSrc={Jojo}
      // map={map}
    />
  );
}
