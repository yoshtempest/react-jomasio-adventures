import styles from "./styles.module.css";

type Props = {
  background?: string;
};

export function ReplayBackground({ background }: Props) {
  if (!background) return null;

  return (
    <div
      className={styles.vpBg}
      style={{
        backgroundImage: `url(${background})`,
      }}
    />
  );
}
