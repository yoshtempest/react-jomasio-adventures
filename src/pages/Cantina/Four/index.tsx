import { cantinaFour } from "@/maps/cantina/four";
import { Scene } from "@/components/Scene";

export default function CantinaFour() {
  return (
    <Scene
      map={cantinaFour}
      className={`Master Cantina`}
      initialPosition={{ x: 9, y: 5, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 15, y: 11 },
          ],
          to: "/hall/one",
        },
      ]}
    />
  );
}