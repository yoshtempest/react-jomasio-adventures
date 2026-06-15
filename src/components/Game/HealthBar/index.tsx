type Props = {
  hp: number;
  maxHp?: number;
  reversed?: boolean;
};

export function HealthBar({ hp, maxHp = 100, reversed = false }: Props) {
  const percentage = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  function getBackgroundColor() {
    if (percentage <= 30) {
      return "red";
    } else if (percentage <= 70) {
      return "orange";
    } else {
      return "limegreen";
    }
  }

  return (
    <div
      style={{
        position: "relative",
        width: 200,
        height: 20,
        border: "2px solid black",
        background: "#333",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          background: getBackgroundColor(),
          transition: "width 0.2s, background 0.2s",
          ...(reversed ? { marginLeft: `${100 - percentage}%` } : {}),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 12,
          fontWeight: "bold",
          textShadow: "1px 1px 2px black",
          pointerEvents: "none",
        }}
      >
        {Math.round(hp)} / {maxHp}
      </div>
    </div>
  );
}
