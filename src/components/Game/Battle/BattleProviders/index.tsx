import type { ReactNode } from "react";
import { BattleInfoProvider } from "@/contexts/BattleInfoContext";

export function BattleProviders({ children }: { children: ReactNode }) {
  return <BattleInfoProvider>{children}</BattleInfoProvider>;
}
