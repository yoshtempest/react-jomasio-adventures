import { firstScreenMap } from "@/maps/firstScreenMap";
import { sceneBackgrounds } from "@/data/sceneBackground";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect } from "react";

export default function FirstScreen() {
  const { closeNavbar } = useNavbar();
  const { setMode } = usePlayer();

  useEffect(() => {
    closeNavbar();
    setMode("explore")
  }, [closeNavbar, setMode]);

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
