type Props = {
  blockLimit: number;
  isBlocking: boolean;
};

export function BlockGauge({ blockLimit, isBlocking }: Props) {
  if (!isBlocking) return null;

  return (
    <div
      style={{
        marginTop: 2,
        width: 200,
        height: 12,
        border: "1px solid #5599ff",
        background: "#1a3355",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#4488ff",
          transition: "width 0.15s",
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
          fontSize: 10,
          fontWeight: "bold",
          textShadow: "1px 1px 2px black",
          pointerEvents: "none",
        }}
      >
        BLOCK {blockLimit}
      </div>
    </div>
  );
}
