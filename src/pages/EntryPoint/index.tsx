import { useEffect } from "react";
import { useNavigate } from "react-router";
import { hasSave } from "@/utils/save/saveGame";

export default function EntryPoint() {
  const navigate = useNavigate();

  useEffect(() => {
    if (hasSave()) {
      void navigate("/home", { replace: true });
    } else {
      void navigate("/tutorial", { replace: true });
    }
  }, [navigate]);

  return null;
}
