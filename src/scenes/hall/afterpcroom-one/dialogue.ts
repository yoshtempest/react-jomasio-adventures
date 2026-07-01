import { AfterPcRoomOneDialogue } from "@/data/dialogues/hall/one/one";
import { AfterPcRoomTwoDialogue } from "@/data/dialogues/hall/one/two";
import { AfterPcRoomThreeDialogue } from "@/data/dialogues/hall/one/three";
import { AfterPcRoomFourDialogue } from "@/data/dialogues/hall/one/four";
import { AfterPcRoomFiveDialogue } from "@/data/dialogues/hall/one/five";
import { AfterPcRoomSixDialogue } from "@/data/dialogues/hall/one/six";
import { AfterPcRoomSevenDialogue } from "@/data/dialogues/hall/one/seven";
import { AfterPcRoomEightDialogue } from "@/data/dialogues/hall/one/eight";
import { AfterPcRoomGenericDialogue } from "@/data/dialogues/hall/one/generic";

import { hasQuest, hasItem } from "@/scenes//shared/helpers";

export const getAfterPcRoomOneDialogue = ({
  quests,
  items,
}: {
  quests: { id: string }[];
  items: { id: ItemId }[];
}) => {
  if (hasItem(items, "aura_letter") && !hasQuest(quests, "search_packaging")) {
    return AfterPcRoomOneDialogue;
  }

  if (hasQuest(quests, "search_packaging") && !hasItem(items, "package_01")) {
    return AfterPcRoomTwoDialogue;
  }

  if (hasItem(items, "package_01") && !hasItem(items, "good_powder")) {
    return AfterPcRoomThreeDialogue;
  }

  if (hasItem(items, "package_01") && hasItem(items, "good_powder")) {
    return AfterPcRoomFourDialogue;
  }

  if (
    hasQuest(quests, "go_cafeteria") &&
    !hasQuest(quests, "return_to_remedinha")
  ) {
    return AfterPcRoomFiveDialogue;
  }

  if (
    hasQuest(quests, "return_to_remedinha") ||
    hasQuest(quests, "encounter_deise")
  ) {
    return AfterPcRoomSixDialogue;
  }

  if (hasQuest(quests, "x1_slimita") && !hasQuest(quests, "go_to_hell")) {
    return AfterPcRoomSevenDialogue;
  }

  if (
    hasQuest(quests, "x1_maugrelo") &&
    !hasQuest(quests, "go_to_brodiclass")
  ) {
    return AfterPcRoomEightDialogue;
  }

  return AfterPcRoomGenericDialogue;
};
