import styles from "./styles.module.css"

interface Props {
  name: string;
  message: string;
}

export default function Talking({ name, message }: Props) {
  return (
    <div className={styles.talking}>
        <h1>{name}</h1>
        <h2>{message}</h2>
    </div>
  )
}