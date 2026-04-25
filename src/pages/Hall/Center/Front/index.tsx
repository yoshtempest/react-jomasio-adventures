import { hallCenterFront } from "@/maps/hall/centerFront";
import { ExploreScene } from "@/components/Game/Scenes/Default";

export default function HallCenterFront() {
  return (
    <ExploreScene
      map={hallCenterFront}
      className={`Master HallCenterFront`}
      initialPosition={{ x: 8, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 7, y: 11 },
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