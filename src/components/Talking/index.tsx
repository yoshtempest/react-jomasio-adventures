import styles from "./styles.module.css"

interface Props {
  name: string;
  message: string;
  src?: string;
}

export default function Talking({ name, message, src }: Props) {
  return (
    <div className={styles.container}>
      {src && <img className={styles.image} src={src} alt={name} />}
      <div className={styles.talking}>
        <h1>{name}</h1>
        <h2>{message}</h2>
      </div>
    </div>
  )
}