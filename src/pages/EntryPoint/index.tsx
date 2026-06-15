import { useEffect } from "react";
import { useNavigate } from "react-router";
import { hasSave } from "@/utils/saveGame";

export default function EntryPoint() {
  const navigate = useNavigate();

  useEffect(() => {
    if (hasSave()) {
      navigate("/home", { replace: true });
    } else {
      navigate("/tutorial", { replace: true });
    }
  }, [navigate]);

  return null;
}
