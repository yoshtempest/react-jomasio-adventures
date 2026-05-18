import styles from "./styles.module.css";
import { useMatchmakingMenu } from "@/hooks/menu/useMatchmakingMenu";

export default function Matchmaking() {
  const {
    selectedIndex,
    options,
    roomCode,
    setRoomCode,
    setTyping,
  } = useMatchmakingMenu();

  return (
    <div className={styles.container}>
      <h1>Modo PVP</h1>

      <div className={styles.menu}>
        {options.map((option, index) => (
          <div
            key={option}
            className={`${styles.option} ${
              selectedIndex === index ? styles.selected : ""
            }`}
          >
            {option}
          </div>
        ))}
      </div>

      {/* 🔥 input só aparece na opção "Entrar" */}
      {selectedIndex === 1 && (
        <input
          className={styles.input}
          value={roomCode}
          onFocus={() => setTyping(true)}
          onBlur={() => setTyping(false)}
          onChange={(e) =>
            setRoomCode(e.target.value.toUpperCase())
          }
          placeholder="Código da sala"
        />
      )}
    </div>
  );
}