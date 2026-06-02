import { BattleScene } from "@/components/Game/Scenes/Battle";
import { firstBattle } from "@/maps/firstBattle";
import DarkSouls from "/assets/songs/DarkSouls.m4a"
import { useFlags } from "@/contexts/FlagContext";

export default function CafeteriaBattle() {
  const { setFlag } = useFlags();

  return (
    <BattleScene
      map={firstBattle}
      npcType="deise"
      redirectTo="/cafeteria/one"
      onVictory={() => {
        setFlag("deise");
      }}
      victoryDescription="Você derrotou Deise, a Lich imortal"
      className="CafeteriaBattle"
      audioSrc={DarkSouls}
    />
  );
}