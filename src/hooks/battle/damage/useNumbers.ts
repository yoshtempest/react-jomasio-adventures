import { useState, useCallback, useRef } from "react";

export type DamageNumber = {
  id: number;
  value: number;
  x: number;
  y: number;
  type: DamageType;
};

export function useDamageNumbers() {
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const idRef = useRef(0);

  const spawnDamageNumber = useCallback(
    (value: number, x: number, y: number, type: DamageType) => {
      const id = idRef.current++;
      const entry: DamageNumber = { id, value, x, y, type };
      setDamageNumbers((prev) => [...prev, entry]);

      setTimeout(() => {
        setDamageNumbers((prev) => prev.filter((n) => n.id !== id));
      }, 1000);
    },
    [],
  );

  const clearDamageNumbers = useCallback(() => {
    setDamageNumbers([]);
  }, []);

  return { damageNumbers, spawnDamageNumber, clearDamageNumbers };
}
