import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { getSkillTree } from "@/data/passiveSkills";
import type { PassiveSkillId } from "@/utils/types/player/passiveSkills";

export function usePassiveSkills(characterId: CharacterId) {
  const { progress } = useCharacterProgress();
  const level = progress[characterId]?.level ?? 1;
  const tree = getSkillTree(characterId);

  function isSkillUnlocked(skillId: PassiveSkillId): boolean {
    const skill = tree.skills.find((s) => s.id === skillId);
    return skill ? level >= skill.levelRequired : false;
  }

  function getSkillProgress(skillId: PassiveSkillId) {
    const skill = tree.skills.find((s) => s.id === skillId);
    if (!skill) return { skill: null, unlocked: false, level, required: 0 };
    return {
      skill,
      unlocked: level >= skill.levelRequired,
      level,
      required: skill.levelRequired,
    };
  }

  return {
    isSkillUnlocked,
    getSkillProgress,
    tree,
    level,
    skills: tree.skills,
  };
}
