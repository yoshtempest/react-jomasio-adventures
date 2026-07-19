import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type BattleInfo = {
  npcType: string;
  npcLevel: number;
  npcClass: NPCClass;
  npcHp: number;
  npcDamage: number;
  npcArmor: number;
};

type BattleInfoContextType = {
  battleInfo: BattleInfo | null;
  setBattleInfo: (info: BattleInfo) => void;
  clearBattleInfo: () => void;
};

const BattleInfoContext = createContext<BattleInfoContextType | null>(null);

export function BattleInfoProvider({ children }: { children: ReactNode }) {
  const [battleInfo, setBattleInfoState] = useState<BattleInfo | null>(null);

  const setBattleInfo = useCallback((info: BattleInfo) => {
    setBattleInfoState(info);
  }, []);

  const clearBattleInfo = useCallback(() => {
    setBattleInfoState(null);
  }, []);

  const valueRef = useRef({ battleInfo, setBattleInfo, clearBattleInfo });
  valueRef.current = { battleInfo, setBattleInfo, clearBattleInfo };

  return (
    <BattleInfoContext.Provider value={valueRef.current}>
      {children}
    </BattleInfoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBattleInfo() {
  return useContext(BattleInfoContext);
}
