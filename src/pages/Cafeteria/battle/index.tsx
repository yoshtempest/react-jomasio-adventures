import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import DarkSouls from "/assets/songs/DarkSouls.m4a"

export default function CafeteriaBattle() {
  return (
    <BattleScene
      map={firstBattle}
      npcType="deise"
      redirectTo="/cafeteria/two"
      victoryDescription="Você derrotou Deise, a Lich imortal"
      className="CafeteriaBattle"
      audioSrc={DarkSouls}
    />
  );
}