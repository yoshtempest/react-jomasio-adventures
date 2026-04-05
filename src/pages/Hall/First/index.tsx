import styles from "./styles.module.css";
import { hallOne } from "@/maps/hall/hallOne";
import { Scene } from "@/components/Scene";

export default function HallOne() {
  return (
    <Scene
      map={hallOne}
      className={`Master ${styles.image}`}
      initialPosition={{ x: 9, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 8, y: 11 },
            { x: 9, y: 11 },
            { x: 10, y: 11 },
          ],
          to: "/cantina/three",
        },
        {
          positions: [{ x: 13, y: 7 }],
          to: "/pcroom",
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