import styles from "./styles.module.css"
import Talking from "../../components/Talking"

export default function Tutorial() {
  return (
    <div className={`Master ${styles.image}`}> 
        <Talking
          name="Duque Cê"
          message="Bem-vindo ao mundo Po- Real, não vou encher linguiça, você deve investigar o CETI Jomásio dos Santos Barros pelo sumiço da comida." />
    </div>
  )
}