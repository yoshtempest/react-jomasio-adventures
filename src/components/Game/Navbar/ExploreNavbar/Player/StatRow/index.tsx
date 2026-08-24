import type { ReactNode } from "react";
import { ProgressBar } from "@/components/Game/ProgressBar";

type StatRowProps = {
  label: ReactNode;
  value: ReactNode;
  progress?: number;
};

export function StatRow({ label, value, progress }: StatRowProps) {
  return (
    <>
      <div className="statRow">
        <span className="statLabel">{label}</span>
        <span className="statValue">{value}</span>
      </div>

      {progress !== undefined && (
        <ProgressBar
          value={progress}
          max={100}
          className="barOuter"
          color="var(--accent-color)"
        />
      )}
    </>
  );
}
