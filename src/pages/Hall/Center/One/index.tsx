import { hallCenter } from "@/maps/hall/center";
import { ExploreScene } from "@/components/Game/Scenes/Default";

export default function HallCenterOne() {
  return (
    <ExploreScene
      map={hallCenter}
      className={`Master HallCenter`}
      initialPosition={{ x: 8, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 9, y: 11 },
          ],
          to: "/hall/left/one",
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