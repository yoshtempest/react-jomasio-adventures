import { useParams } from "react-router";
import { LibraryScene } from "@/features/library/index";
import type { SceneId } from "@/utils/types/maps/sceneConfig";

export default function LibraryPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <LibraryScene sceneId={id as SceneId} />;
}