import type { ReactNode } from "react";
import { BattleInfoProvider } from "@/contexts/BattleInfoContext";
import { BattleNavbarProvider } from "@/contexts/BattleNavbarContext";

export function BattleProviders({ children }: { children: ReactNode }) {
  return (
    <BattleInfoProvider>
      <BattleNavbarProvider>{children}</BattleNavbarProvider>
    </BattleInfoProvider>
  );
}
