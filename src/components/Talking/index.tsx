import styles from "./styles.module.css"

interface Props {
  name: string;
  message: string;
  src?: string;
}

function resolveAsset(path?: string) {
  if (!path) return "";

  // já resolvido pelo Vite
  if (
    path.startsWith("http") ||
    path.startsWith(import.meta.env.BASE_URL)
  ) {
    return path;
  }

  // assets antigos
  if (path.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${path.slice(1)}`;
  }

  return path;
}

export default function Talking({ name, message, src }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.talking}>
        <h1>{name}</h1>
        <h2>{message}</h2>
      </div>
      {src && (
        <img
          className={styles.image}
          src={resolveAsset(src)}
          alt={name}
        />
      )}
    </div>
  )
}