import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import DarkSouls from "/assets/songs/DarkSouls.m4a"

export default function CafeteriaBattleTwo() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="denis"
      redirectTo="/cafeteria/four"
      victoryDescription="Você derrotou Denis, o Senhor dos Linguições"
      className="CafeteriaBattle"
      audioSrc={DarkSouls}
    />
  );
}