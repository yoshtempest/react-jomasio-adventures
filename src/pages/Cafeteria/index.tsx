import { cafeteria } from "@/maps/cafeteria";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { cafeteriaDialogue } from "@/data/maps/cafeteria/one";

export default function CafeteriaOne() {

  return (
    <ExploreScene
      map={cafeteria}
      className={`Master Cafeteria`}
      dialogueData={cafeteriaDialogue} 
      nextRoute={"/cafeteria/battle"}
      initialPosition={{ x: 9, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [{ x: 8, y: 11 }],
          to: "/cantina/four",
        },
      ]}
      npcs={[
        {
          src: "/src/assets/npcs/deise/default.svg",
          gridX: 14,
          gridY: 5,
        },
      ]}
    />
  );
}