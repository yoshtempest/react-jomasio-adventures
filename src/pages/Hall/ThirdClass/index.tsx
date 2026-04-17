import { hallCenter } from "@/maps/hall/center";
import { Scene } from "@/components/Scene";

export default function HallThirdClass() {
  return (
    <Scene
      map={hallCenter}
      className={`Master HallThirdClass`}
      initialPosition={{ x: 8, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 8, y: 11 },
          ],
          to: "/hall/center/front",
        },
        {
          positions: [
            { x: 8, y: 5 },
          ],
          to: "/library",
        },
      ]}
    />
  );
}