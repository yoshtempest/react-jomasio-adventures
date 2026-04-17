import { hallCenter } from "@/maps/hall/center";
import { Scene } from "@/components/Scene";

export default function HallCenterFront() {
  return (
    <Scene
      map={hallCenter}
      className={`Master HallCenterFront`}
      initialPosition={{ x: 8, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 8, y: 11 },
          ],
          to: "/hall/center/one",
        },
        {
          positions: [
            { x: 11, y: 7 },
          ],
          to: "/hall/thirdclass",
        },
      ]}
    />
  );
}