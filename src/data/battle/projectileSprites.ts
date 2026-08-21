import { npcPathPets, npcPathProjectile } from "@/utils/paths";

export const spriteMap: Record<string, string> = {
  dish: npcPathProjectile("/dish.svg"),
  "goat-idle": npcPathPets("/goat/default.svg"),
  "goat-walk": npcPathPets("/goat/walk.svg"),
  staff: npcPathProjectile("/staff.svg"),
  spear: npcPathProjectile("/spear.svg"),
  spoon: npcPathProjectile("/spoon.svg"),
  knife: npcPathProjectile("/knife.svg"),
  paper: npcPathProjectile("/paper.svg"),
};
