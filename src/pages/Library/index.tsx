import { Scene } from "@/components/Scene";
import { library } from "@/maps/library";

export default function Library() {
  return (
    <div className={`Master Library`}>
      <Scene
        map={library}
        className={`Master Library`}
        initialPosition={{ x: 4, y: 4, direction: "down" }}
        transitions={[
            {
                positions: [
                    { x: 4, y: 3 },
                ],
                to: "/hall/thirdclass",
            },
        ]}
      />
    </div>
  );
}