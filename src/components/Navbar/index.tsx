import { Link } from "react-router";
import styles from "./styles.module.css"
import { blocked } from "@/maps/blocked";
import { useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";

export function Navbar() {
  const { setMap, setMode } = usePlayer();
    useEffect(() => {
      setMap(blocked);
      setMode("select");
    }, [blocked]);
  return (
    <nav id="Navbar" className={styles.navbar}>
      <ul className={styles.list}>
        <Link to="/character"><li className={styles.item}>Personagem</li></Link>
        <Link to="/inventory"><li className={styles.item}>Mochila</li></Link>
        <Link to="/config"><li className={styles.item}>Configurações</li></Link>
      </ul>
    </nav>
  )
}