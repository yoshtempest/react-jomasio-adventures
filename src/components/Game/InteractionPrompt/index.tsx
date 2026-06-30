import styles from "./styles.module.css";

type Props = {
  text: string;
};

export function InteractionPrompt({ text }: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.hint}>{text}</span>
    </div>
  );
}
