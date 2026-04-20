import { hallThirdClass } from "@/maps/hall/thirdClass";
import { Scene } from "@/components/Game/Scenes/Default";

export default function HallThirdClass() {
  return (
    <Scene
      map={hallThirdClass}
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