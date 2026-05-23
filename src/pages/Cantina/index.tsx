import { useParams } from "react-router";
import { CantinaScene } from "@/features/cantina/index";
import type { SceneId } from "@/utils/types/maps/sceneConfig";

export default function CantinaPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <CantinaScene sceneId={id as SceneId} />;
}