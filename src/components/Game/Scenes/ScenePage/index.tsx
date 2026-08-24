import { useParams } from "react-router";
import type { ComponentType } from "react";

type Props = {
  SceneComponent: ComponentType<{ sceneId: SceneId }>;
};

export default function ScenePage({ SceneComponent }: Props) {
  const { id } = useParams();
  if (!id) return <div>Parâmetro de cena não fornecido</div>;
  return <SceneComponent sceneId={id as SceneId} />;
}
