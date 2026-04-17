import { hallOne } from "@/maps/hall/one";
import { Scene } from "@/components/Scene";

export default function HallOne() {
  return (
    <Scene
      map={hallOne}
      className={`Master HallOne`}
      initialPosition={{ x: 9, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 8, y: 11 },
          ],
          to: "/cantina/four",
        },
        {
          positions: [{ x: 13, y: 7 }],
          to: "/pcroom/one",
        },
        {
          positions: [
            { x: 7, y: 2 },
            { x: 8, y: 2 },
            { x: 9, y: 2 },
          ],
          to: "/hall/two",
        },
      ]}
    />
  );
}