type Props = {
  hp: number;
  maxHp?: number;
};

export function HealthBar({ hp, maxHp = 100 }: Props) {
  const percentage = Math.max(
    0,
    Math.min(100, (hp / maxHp) * 100)
  );

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
        }}
      />
    </div>
  );
}