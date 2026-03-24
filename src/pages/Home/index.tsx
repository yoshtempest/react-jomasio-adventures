import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "../../contexts/GameControlsContext";
import styles from "./styles.module.css";

export default function Home() {
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();

  useEffect(() => {
    setOnConfirm(() => () => navigate("/firstscreen"));

    return () => {
      setOnConfirm(undefined);
    };
  }, []);

  return (
    <div className={`Master ${styles.image}`}>
      <img
        src="/src/assets/logo.svg"
        alt="Pressione A para continuar"
        className={styles.logo}
      />
      <h1>Pressione A para continuar</h1>
    </div>
  );
}