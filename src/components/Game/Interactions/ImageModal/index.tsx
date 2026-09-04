import styles from "./styles.module.css";
import { resolveAsset } from "@/utils/paths";
import Talking from "@/components/Game/Interactions/Talking";

type Props = {
  src: string;
  message?: string;
  name?: string;
  onClose: () => void;
};

export function ImageModal({ src, message, name = "Sistema", onClose }: Props) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <img
        className={styles.image}
        src={resolveAsset(src)}
        alt=""
        onClick={(e) => e.stopPropagation()}
      />
      {message && <Talking name={name} message={message} onNext={onClose} />}
    </div>
  );
}
