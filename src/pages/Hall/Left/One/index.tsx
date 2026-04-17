import { hallLeft } from "@/maps/hall/left";
import { Scene } from "@/components/Scene";

export default function HallLeftOne() {
  return (
    <Scene
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