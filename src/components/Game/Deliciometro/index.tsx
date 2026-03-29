type Props = {
  delicia: number; // 0 - 6
  maxDelicia?: number;
};

export function Deliciometro({ delicia, maxDelicia = 6 }: Props) {
  const angle = (delicia / maxDelicia) * 180;

  return (
    <div
      style={{
        width: 200,
        height: 20,
        border: "2px solid black",
        background: "#333",
      }}
    >
        <img src="/src/assets/deliciometro.svg" 
        style={{
          width: "100%",
          height: "100%",
        }}/>
        <div
            style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            width: 4,
            height: 60,
            background: "red",
            transformOrigin: "bottom left",
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transition: "transform 0.2s ease",
            }}
        />
        </div>
    );
}