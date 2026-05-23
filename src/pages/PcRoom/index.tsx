import { useParams } from "react-router";
import { PcRoomScene } from "@/features/pcRoom";
import type { SceneId } from "@/utils/types/maps/sceneConfig";

export default function PcRoomPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <PcRoomScene sceneId={id as SceneId} />;
}