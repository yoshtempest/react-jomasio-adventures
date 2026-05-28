import { useParams } from "react-router";
import { DirectorScene } from "@/features/director/index";
import type { SceneId } from "@/utils/types/maps/sceneConfig";

export default function DirectorPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <DirectorScene sceneId={id as SceneId} />;
}