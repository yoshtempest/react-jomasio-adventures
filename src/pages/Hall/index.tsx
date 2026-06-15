import { useParams } from "react-router";
import { HallScene } from "@/features/hall";

export default function HallPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <HallScene sceneId={id as SceneId} />;
}
