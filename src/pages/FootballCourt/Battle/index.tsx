import { BattleScene } from "@/components/Game/Scenes/Battle";
import KenTheme from "/assets/songs/StreetFighter5KenTheme.m4a";
import { useFlags } from "@/contexts/FlagContext";

export default function FootballCourtBattle() {
  const { setFlag } = useFlags();
  return (
    <BattleScene
      npcType="neimito"
      redirectTo="/footballcourt/one"
      onVictory={() => {
        setFlag("neimito");
      }}
      victoryDescription="Você derrotou 'Neimito, o mestre do calor'"
      className="CantinaBattle"
      audioSrc={KenTheme}
    />
  );
}
