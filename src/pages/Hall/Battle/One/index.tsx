import { BattleScene } from "@/components/Game/Scenes/Battle";
import SpiderDance from "/assets/songs/SpiderDance.m4a";
import { useFlags } from "@/contexts/FlagContext";

export default function JailsonHallBattle() {
  const { setFlag } = useFlags();

  return (
    <BattleScene
      npcType="slimita"
      redirectTo="/hall/jailson-two"
      onVictory={() => {
        setFlag("slimita");
      }}
      victoryDescription="Você derrotou Slimita, a Paquera de Jailson"
      className="jailsonHallBattle"
      audioSrc={SpiderDance}
    />
  );
}
