// PcRoomPage.tsx

import { useParams } from "react-router";
import { PcRoomScene } from "./PcRoomScene";

export default function PcRoomPage() {
  const { id } = useParams();

  return <PcRoomScene sceneId={id as any} />;
}