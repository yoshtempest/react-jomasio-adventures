import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ReplayPlayer } from "@/components/Game/Battle/Replay";
import { getReplayById } from "@/data/replays";

export default function Replay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const replay = id ? getReplayById(id) : null;

  useEffect(() => {
    if (!replay) {
      void navigate("/home", { replace: true });
    }
  }, [replay, navigate]);

  if (!replay) return null;

  return <ReplayPlayer replay={replay} onClose={() => navigate(-1)} />;
}
