import styles from "./styles.module.css";
import { firstScreenMap } from "@/maps/firstScreenMap";
import { Scene } from "@/components/Scene";

export default function FirstScreen() {

  return (
    <Scene
      map={firstScreenMap}
      className={`Master ${styles.image}`}
      initialPosition={{ x: 6, y: 11, direction: "up" }}
      transitions={[
        {
          positions: [
            { x: 6, y: 7 },
          ],
          to: "/cantina/one",
        },
      ]}
    />
  );
}