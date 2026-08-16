import { useEffect, useRef } from "react";

type Props = {
  src: string;
  width: number;
  height: number;
  onEnded?: () => void;
};

const BUFFER_SCALE = 2;

export function CutsceneVideo({ src, width, height, onEnded }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const bufferWidth = Math.round(width * BUFFER_SCALE);
  const bufferHeight = Math.round(height * BUFFER_SCALE);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let rafId = 0;

    const draw = () => {
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const greenness = g - Math.max(r, b);

          if (greenness > 60) {
            data[i + 3] = 0;
          } else if (greenness > 20) {
            data[i + 3] = Math.round((1 - (greenness - 20) / 40) * 255);
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => onEndedRef.current?.()}
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        width={bufferWidth}
        height={bufferHeight}
        style={{ width, height, display: "block" }}
      />
    </>
  );
}
