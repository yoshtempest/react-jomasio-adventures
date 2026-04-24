import { useParams } from "react-router";
import { PcRoomScene } from "@/components/Game/Scenes/PcRoom/PcRoomScene";

export default function PcRoomPage() {
  
  const { id } = useParams();
  console.log("params:", useParams());

    if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <PcRoomScene sceneId={id as any} />;
}