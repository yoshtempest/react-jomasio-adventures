import type { ReactNode } from "react";
import { BattleInfoProvider } from "@/contexts/BattleInfoContext";
import { BattleManaProvider } from "@/contexts/BattleManaContext";

export function BattleProviders({ children }: { children: ReactNode }) {
  return (
    <BattleInfoProvider>
      <BattleManaProvider>{children}</BattleManaProvider>
    </BattleInfoProvider>
  );
}
