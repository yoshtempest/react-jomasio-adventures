import { useState, useRef, useEffect } from "react";

export function useSelectableIndex(initialIndex = 0) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  return { selectedIndex, setSelectedIndex, selectedIndexRef };
}
