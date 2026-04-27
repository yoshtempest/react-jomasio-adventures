import styles from "./styles.module.css";
import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";

export function Config() {

  return (
    <div className={styles.inventory}>
      <h3>Como funciona a movimentação:</h3>
      <div className={styles.row}>
        <div className={styles.movement}>
          <MoveUp size={16} className={styles.up}/>

          <MoveLeft size={16} className={styles.left}/>

          <div className={styles.empty}></div>

          <MoveRight size={16} className={styles.right}/>

          <MoveDown size={16} className={styles.down}/>
        </div>

        <div className={styles.column}>
          <p>Basta apertar na direção que você deseja ir.</p>
          <p>Como pode ver, é bem simples</p>
        </div>
      </div>
      <h3>Como funcionam os controles:</h3>
      <div className={styles.row}>
        <div className={styles.gameButtons}>
            <button className={styles.button}>
              B
            </button>
        </div>
        <p>
          Ao clicar em "B" enquanto está em batalha, 
          você consegue usar seu Special, e, 
          caso seu deliciomêtro esteja carregado, 
          você consegue causar dano massivo no oponente. 
          Além disso, "B" também pode ser usado para fechar os menus.
        </p>
      </div>
      <div className={styles.row}>
        <button className={styles.button}> L </button>
        <p>
          Ao clicar em "L", você consegue interagir com as pessoas e com o mapa, 
          caso esteja em batalha, 
          você ataca ao invés disso.
        </p>
      </div>
      <div className={styles.row}>
        <button className={styles.open} />
        <p>
          Ao clicar em "G" pelo teclado ou nesse quadrado retangular, você consegue abrir os menus,
          assim como você fez 
          caso esteja em batalha, 
          e com o deliciomêtro carregado,
          futuramente você poderá utilizar o modo awakening (despertar).
        </p>
      </div>
    </div>
  );
}