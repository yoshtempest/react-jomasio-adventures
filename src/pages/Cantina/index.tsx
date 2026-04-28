import { useParams } from "react-router";
import { CantinaScene } from "@/components/Game/Scenes/Cantina/index";

export default function CantinaPage() {
  
  const { id } = useParams();

    if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <CantinaScene sceneId={id as any} />;
}