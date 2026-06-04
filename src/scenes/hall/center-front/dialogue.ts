import { centerFrontDialogue } from "@/data/maps/hall/centerFront/one";
import { centerFrontTwoDialogue } from "@/data/maps/hall/centerFront/two";
import { centerFrontThreeDialogue } from "@/data/maps/hall/centerFront/three";
import { centerFrontFourDialogue } from "@/data/maps/hall/centerFront/four";

import type { CharacterId } from "@/utils/types/player/character";
import type { QuestId } from "@/data/quests";
import { hasQuest, playerCharacter} from "@/scenes/shared/helpers";

export const getCenterFrontDialogue = ({
  quests,
  characters
}: {
  quests: { id: QuestId }[],
  characters: { id: CharacterId }[]
}) => {
  if (
    playerCharacter(characters, "marcelo") &&
    !hasQuest(quests, "save_samurion") &&
    !hasQuest(quests, "save_ematron")
    ) {
    return centerFrontFourDialogue;
  }

  if (hasQuest(quests, "save_ematron")) {
    return centerFrontThreeDialogue;
  }

  if (hasQuest(quests, "save_samurion") && !hasQuest(quests, "save_ematron")) {
    return centerFrontTwoDialogue;
  }

  return centerFrontDialogue;
};