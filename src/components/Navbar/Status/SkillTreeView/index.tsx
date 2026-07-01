import { usePlayer } from "@/contexts/PlayerContext";
import { PassiveSkills } from "@/components/PassiveSkills";

export function SkillTreeView() {
  const { player } = usePlayer();

  return (
    <div className="containerOfNavbar">
      <h2>Árvore de Habilidades</h2>
      <PassiveSkills characterId={player.character} />
    </div>
  );
}
