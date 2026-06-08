import { useParams } from "react-router";
import { FootballCourtScene } from "@/features/footballCourt/index";
import type { SceneId } from "@/utils/types/maps/sceneConfig";

export default function FootbalLCourtPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <FootballCourtScene sceneId={id as SceneId} />;
}