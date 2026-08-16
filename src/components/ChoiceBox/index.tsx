import { useEffect, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import styles from "./styles.module.css";

interface Props {
  prompt: string;
  options: string[];
  onSelect: (index: number) => void;
}

export function ChoiceBox({ prompt, options, onSelect }: Props) {
  const [selected, setSelected] = useState(0);
  const { pushControls } = useGameControls();
  const onSelectRef = useLatestRef(onSelect);

  useEffect(() => {
    const controls = {
      onUp: () => {
        setSelected((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        return true;
      },
      onDown: () => {
        setSelected((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        return true;
      },
      onLeft: () => true,
      onRight: () => true,
      onConfirm: () => {
        onSelectRef.current(selected);
        return true;
      },
    };

    const remove = pushControls(controls);
    return remove;
  }, [pushControls, options.length, selected, onSelectRef]);

  return (
    <div className={`overlay ${styles.overlay}`}>
      <div className={styles.box}>
        <p className={styles.prompt}>{prompt}</p>
        <ul className={styles.options}>
          {options.map((opt, i) => (
            <li
              key={opt}
              className={`${styles.option} ${i === selected ? styles.optionSelected : ""}`}
            >
              {i === selected ? "▶ " : "  "}
              {opt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
