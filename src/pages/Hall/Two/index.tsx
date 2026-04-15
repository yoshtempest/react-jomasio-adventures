import styles from "./styles.module.css";
import { hallTwo } from "@/maps/hall/two";
import { Scene } from "@/components/Scene";

export default function HallTwo() {
  return (
    <Scene
      map={hallTwo}
      className={`Master ${styles.image}`}
      initialPosition={{ x: 9, y: 10, direction: "up" }}
      transitions={[
        {
          positions: [{ x: 14, y: 7 }],
          to: "/professorsroom",
        },
        {
          positions: [{ x: 12, y: 4 }],
          to: "/classtwo",
        },
        {
          positions: [
            { x: 7, y: 11 },
            { x: 8, y: 11 },
            { x: 9, y: 11 },
          ],
          to: "/hall/one",
        },
      ]}
    />
  );
}