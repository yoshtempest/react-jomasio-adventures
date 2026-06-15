import { useParams } from "react-router";
import { HellScene } from "@/features/hellRoom";

export default function HellRoomPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <HellScene sceneId={id as SceneId} />;
}
