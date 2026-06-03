import { BattleScene } from "@/components/Game/Scenes/Battle";
import Jojo from "/assets/songs/Jojo.m4a";
import { useNavigate } from "react-router";


export default function VandinhaFragmentBattle() {
  const navigate = useNavigate();
  return (
    <BattleScene
      npcType="vandinhaFragment"
      onVictory={() => navigate(-1)}
      className="PcRoomBattle"
      victoryDescription="Você derrotou um fragmento de Vandinha"
      audioSrc={Jojo}
    />
  );
}