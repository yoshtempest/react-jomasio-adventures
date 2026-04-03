import { Link } from "react-router";
import styles from "./styles.module.css"

export default function Navbar() {
  return (
    <nav id="Navbar" className={styles.navbar}>
      <h1 className={styles.title}>Navbar</h1>
      <ul className={styles.list}>
        <Link to="/status"><li className={styles.item}>Status</li></Link>
        <Link to="/inventory"><li className={styles.item}>Mochila</li></Link>
        <Link to="/config"><li className={styles.item}>Configurações</li></Link>
      </ul>
    </nav>
  )
}