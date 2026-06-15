import { useParams } from "react-router";
import { FootballCourtScene } from "@/features/footballCourt/index";

export default function FootbalLCourtPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Parâmetro de cena não fornecido</div>;
  }

  return <FootballCourtScene sceneId={id as SceneId} />;
}
