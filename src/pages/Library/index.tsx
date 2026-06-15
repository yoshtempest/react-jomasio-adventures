import { useParams } from "react-router";
import { LibraryScene } from "@/features/library/index";

export default function LibraryPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <LibraryScene sceneId={id as SceneId} />;
}
