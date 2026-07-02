import { ExploreScene } from "@/components/Game/Scenes/Default";
import { cafeteriaDialogue } from "@/data/dialogues/cafeteria/one";
import { sceneBackgrounds } from "@/data/sceneBackground";
import toothlessDancing from "/assets/songs/ToothlessDancing.m4a";
import { brodiClass } from "@/maps/brodiClass";

export default function BrodiClassOne() {
  return (
    <div className="Master" style={{ backgroundImage: `url(${sceneBackgrounds.BrodiClass})` }}>
      <ExploreScene
        map={brodiClass}
        dialogueData={cafeteriaDialogue}
        nextRoute={"/cafeteria/battle"}
        initialPosition={{ x: 4, y: 4, direction: "down" }}
        audio={{
          src: toothlessDancing,
          loop: true,
          volume: 0.5,
        }}
        transitions={[
          {
            positions: [{ x: 4, y: 3 }],
            to: "/hall/thirdclass",
          },
        ]}
        npcs={[
          {
            src: "/assets/player/samuel/movement/right.svg",
            gridX: 6,
            gridY: 6,
          },
          {
            src: "/assets/player/riquelme/movement/down.svg",
            gridX: 9,
            gridY: 4,
          },
          {
            src: "/assets/player/lucaua/movement/right.svg",
            gridX: 2,
            gridY: 7,
          },
          {
            src: "/assets/player/marcelo/movement/up.svg",
            gridX: 8,
            gridY: 8,
          },
          {
            src: "/assets/player/emanuel/default.svg",
            gridX: 14,
            gridY: 4,
          },
          {
            src: "/assets/player/artur/movement/down.svg",
            gridX: 7,
            gridY: 4,
          },
          {
            src: "/assets/player/lucas/default.svg",
            gridX: 11,
            gridY: 4,
          },
          {
            src: "/assets/player/larissa/movement/up.svg",
            gridX: 15,
            gridY: 10,
          },
          {
            src: "/assets/player/eduarda/movement/up.svg",
            gridX: 14,
            gridY: 10,
          },
          {
            src: "/assets/player/mayra/default.svg",
            gridX: 13,
            gridY: 9,
          },
          {
            src: "/assets/player/camilly/default.svg",
            gridX: 14,
            gridY: 8,
          },
        ]}
      />
    </div>
  );
}
