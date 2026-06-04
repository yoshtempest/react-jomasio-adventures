import { firstScreenMap } from "@/maps/firstScreenMap";
import { ExploreScene } from "@/components/Game/Scenes/Default";

export default function FirstScreen() {
  return (
    <ExploreScene
      map={firstScreenMap}
      className={`Master FirstScreen`}
      initialPosition={{ x: 6, y: 11, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 6, y: 7 },
          ],
          to: "/cantina/one",
        },
      ]}
    />
  );
}