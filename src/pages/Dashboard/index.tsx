import styles from "./styles.module.css"

export default function HomePage() {
  return (
    <div className={`Master ${styles.image}`}> 
      <img
        src="/src/assets/logo.svg"
        alt="Pressione A para continuar"
        className={styles.logo}
      />
      <h1>Pressione A para continuar</h1>
    </div>
  )
}