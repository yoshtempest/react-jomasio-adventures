import { useParams } from "react-router";
import { PcRoomScene } from "@/features/pcRoom";

export default function PcRoomPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <PcRoomScene sceneId={id as SceneId} />;
}
