import { Link } from "react-router";
import styles from "./styles.module.css"

export default function Navbar() {
  return (
    <nav id="Navbar" className={styles.navbar}>
      <h1 className={styles.title}>Navbar</h1>
      <ul className={styles.list}>
        <Link to="/home"><li className={styles.item}>Status</li></Link>
        <Link to="/home"><li className={styles.item}>Mochila</li></Link>
        <Link to="/about"><li className={styles.item}>Configurações</li></Link>
        <Link to="/contact"><li className={styles.item}>Salvar</li></Link>
      </ul>
    </nav>
  )
}