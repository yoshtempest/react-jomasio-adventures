type Props = {
  hp: number;
  maxHp?: number;
};

export function HealthBar({ hp, maxHp = 100 }: Props) {
  const percentage = Math.max(
    0,
    Math.min(100, (hp / maxHp) * 100)
  );

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
          background: "limegreen",
          transition: "width 0.2s",
        }}
      />
    </div>
  );
}