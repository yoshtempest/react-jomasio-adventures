import styles from "./styles.module.css";
import { useMapMenu } from "@/hooks/menu/useMap";
import { jomasioPath, playerPath } from "@/utils/paths";

type MapCell = {
  routes: string[];
  image: string;
  label: string;
};

const SCENE_MAP: (MapCell | null)[][] = [
  [
    null,
    {
      routes: ["/library"],
      image: jomasioPath("/library/default.svg"),
      label: "Biblioteca",
    },
    {
      routes: ["/hall/thirdclass"],
      image: jomasioPath("/hall/thirdClass.svg"),
      label: "Third Class",
    },
    {
      routes: ["/brodiclass"],
      image: jomasioPath("/brodiClass.svg"),
      label: "Conselho dos Brodi",
    },
  ],
  [
    null,
    {
      routes: ["/hall/center-front"],
      image: jomasioPath("/hall/centerFront.svg"),
      label: "Corredor Norte",
    },
    {
      routes: ["/hall/jailson-one", "/hall/jailson-two"],
      image: jomasioPath("/hall/two.svg"),
      label: "Corredor Direita",
    },
    null,
  ],
  [
    {
      routes: ["/cantina"],
      image: jomasioPath("/cantina.svg"),
      label: "Refeitorio",
    },
    {
      routes: ["/hall/center-one", "/hall/center-two"],
      image: jomasioPath("/hall/center.svg"),
      label: "Corredor Central",
    },
    {
      routes: ["/hall/hell"],
      image: jomasioPath("/hall/hell.svg"),
      label: "Hell",
    },
    {
      routes: ["/footballcourt"],
      image: jomasioPath("/footballCourt.svg"),
      label: "Quadra",
    },
  ],
  [
    {
      routes: ["/cafeteria"],
      image: jomasioPath("/cafeteria.svg"),
      label: "Cantina",
    },
    {
      routes: ["/hall/left-one"],
      image: jomasioPath("/hall/left.svg"),
      label: "Corredor Esquerda",
    },
      {
      routes: ["/hall/one", "/hall/afterpcroom-one"],
      image: jomasioPath("/hall/one.svg"),
      label: "Corredor Um",
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
  ],
  [
    {
      routes: ["/pcroom"],
      image: jomasioPath("/pcsRoom.svg"),
      label: "Sala dos PCs",
    },
    null,
    {
      routes: ["/hall/pandemony"],
      image: jomasioPath("/hall/pandemony.svg"),
      label: "Pandemonio",
    },
    null,
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
            if (!cell) {
              return (
                <div key={`${x}-${y}`} className={`${styles.cell} ${styles.empty}`} />
              );
            }
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
