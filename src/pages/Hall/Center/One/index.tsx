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
            { x: 8, y: 5 },
          ],
          to: "/hall/center/two",
        },
        {
          positions: [
            { x: 14, y: 7 },
          ],
          to: "/hall/right/one",
        },
        {
          positions: [
            { x: 3, y: 7 },
          ],
          to: "/cantina/four",
        },
      ]}
    />
  );
}