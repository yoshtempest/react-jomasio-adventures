import { firstScreenMap } from "@/maps/firstScreenMap";
import { sceneBackgrounds } from "@/data/sceneBackground";
import { ExploreScene } from "@/components/Game/Scenes/Default";

export default function FirstScreen() {
  return (
    <div className="Master" style={{ backgroundImage: `url(${sceneBackgrounds.FirstScreen})` }}>
      <ExploreScene
        map={firstScreenMap}
        initialPosition={{ x: 6, y: 11, direction: "up" }}
        transitions={[
          {
            positions: [{ x: 6, y: 7 }],
            to: "/cantina/one",
          },
        ]}
      />
    </div>
  );
}
