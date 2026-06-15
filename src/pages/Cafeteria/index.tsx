import { useParams } from "react-router";
import { CafeteriaScene } from "@/features/cafeteria";

export default function CafeteriaPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <CafeteriaScene sceneId={id as SceneId} />;
}
