import { hallCenter } from "@/maps/hall/center";
import { Scene } from "@/components/Game/Scenes/Default";

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
          to: "/cantina/four",
        },
        {
          positions: [
            { x: 15, y: 6 },
            { x: 8, y: 5 },
          ],
          to: "/hall/center/front",
        },
        {
          positions: [
            { x: 14, y: 7 },
          ],
          to: "/hall/center/right",
        },
        {
          positions: [
            { x: 3, y: 7 },
          ],
          to: "/hall/left/one",
        },
      ]}
    />
  );
}