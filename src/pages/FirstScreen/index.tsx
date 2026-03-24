import styles from "./styles.module.css"

export default function FirstScreen() {
  return (
    <div className={`Master ${styles.image}`}> 
      <img
        src="/src/assets/logo.svg"
        alt="Pressione A para continuar"
        className={styles.logo}
      />
    </div>
  )
}