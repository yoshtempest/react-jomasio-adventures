import { cafeteria } from "@/maps/cafeteria";
import { ExploreScene } from "@/components/Game/Scenes/Default";

export default function CafeteriaOne() {

  return (
    <ExploreScene
      map={cafeteria}
      className={`Master Cafeteria`}
      initialPosition={{ x: 9, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [{ x: 8, y: 11 }],
          to: "/cantina/four",
        },
      ]}
    />
  );
}