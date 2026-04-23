import { hallLeft } from "@/maps/hall/left";
import { ExploreScene } from "@/components/Game/Scenes/Default";
export default function HallLeftOne() {
  return (
    <ExploreScene
      map={hallLeft}
      className={`Master HallLeft`}
      initialPosition={{ x: 8, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 8, y: 11 },
          ],
          to: "/hall/afterpcroom/two",
        },
        {
          positions: [
            { x: 9, y: 4 },
            { x: 8, y: 4 },
          ],
          to: "/hall/center/one",
        },
      ]}
    />
  );
}