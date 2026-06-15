import { useParams } from "react-router";
import { HallScene } from "@/features/hall";
import type { SceneId } from "@/utils/types/maps/sceneConfig";

export default function HallPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <HallScene sceneId={id as SceneId} />;
}
