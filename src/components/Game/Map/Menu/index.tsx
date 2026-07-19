import styles from "./styles.module.css";
import { useMapMenu } from "@/hooks/menu/useMap";
import { jomasioPath, playerPath } from "@/utils/paths";

type MapCell = {
  routes: string[];
  image: string;
  label: string;
};

const SCENE_MAP: MapCell[][] = [
  [
    {
      routes: ["/cantina"],
      image: jomasioPath("/cantina.svg"),
      label: "Refeitório",
    },
    {
      routes: ["/hall/one"],
      image: jomasioPath("/hall/center.svg"),
      label: "Corredor",
    },
    {
      routes: ["/library"],
      image: jomasioPath("/library/default.svg"),
      label: "Biblioteca",
    },
    {
      routes: ["/brodiclass"],
      image: jomasioPath("/brodiClass.svg"),
      label: "Conselho dos Brodi",
    },
  ],
  [
    {
      routes: ["/cafeteria"],
      image: jomasioPath("/cafeteria.svg"),
      label: "Cantina",
    },
    {
      routes: ["/director"],
      image: jomasioPath("/director.svg"),
      label: "Diretoria",
    },
    {
      routes: ["/hellroom"],
      image: jomasioPath("/hellRoom.svg"),
      label: "Segundo B",
    },
    {
      routes: ["/footballcourt"],
      image: jomasioPath("/footballCourt.svg"),
      label: "Quadra",
    },
  ],
  [
    {
      routes: ["/pcroom"],
      image: jomasioPath("/pcsRoom.svg"),
      label: "Sala dos PCs",
    },
  ],
];

type Props = {
  currentRoute: string;
  character: string;
};

function matchCell(cell: MapCell, route: string) {
  return cell.routes.some((prefix) => route.startsWith(prefix));
}

export function MapOverlay({ currentRoute, character }: Props) {
  useMapMenu();

  return (
    <div className={styles.mapOverlay}>
      <div className={styles.mapGrid}>
        {SCENE_MAP.map((row, y) =>
          row.map((cell, x) => {
            const isCurrent = matchCell(cell, currentRoute);
            return (
              <div
                key={`${x}-${y}`}
                className={`${styles.cell} ${isCurrent ? styles.current : ""}`}
              >
                <img
                  className={styles.sceneImage}
                  src={cell.image}
                  alt={cell.label}
                />
                <span className={styles.label}>{cell.label}</span>
                {isCurrent && (
                  <img
                    className={styles.face}
                    src={playerPath(`${character}/face.svg`)}
                    alt="Jogador"
                  />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
