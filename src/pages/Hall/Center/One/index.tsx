import { hallCenter } from "@/maps/hall/center";
import { Scene } from "@/components/Scene";

export default function HallCenterOne() {
  return (
    <Scene
      map={hallCenter}
      className={`Master HallCenter`}
      initialPosition={{ x: 8, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 8, y: 11 },
          ],
          to: "/hall/left/one",
        },
        {
          positions: [
            { x: 15, y: 6 },
            { x: 9, y: 8 },
            { x: 3, y: 7 },
          ],
          to: "/hall/center/one",
        },
      ]}
    />
  );
}