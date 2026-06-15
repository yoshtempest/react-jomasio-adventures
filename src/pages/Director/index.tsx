import { useParams } from "react-router";
import { DirectorScene } from "@/features/director/index";

export default function DirectorPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <DirectorScene sceneId={id as SceneId} />;
}
