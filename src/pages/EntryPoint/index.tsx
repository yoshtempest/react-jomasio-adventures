import { useEffect } from "react";
import { useNavigate } from "react-router";
import { hasSave } from "@/services/save/saveService";

export default function EntryPoint() {
  const navigate = useNavigate();

  useEffect(() => {
    if (hasSave()) {
      void navigate("/home", { replace: true });
    } else {
      void navigate("/firstCutscene", { replace: true });
    }
  }, [navigate]);

  return null;
}
