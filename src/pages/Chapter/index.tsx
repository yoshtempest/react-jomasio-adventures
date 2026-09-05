import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { CHAPTER_SCREEN_DURATION_MS, getChapter } from "@/data/chapters";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import styles from "./styles.module.css";

export default function Chapter() {
  const navigate = useNavigate();
  const { id } = useParams();
  const chapter = getChapter(id);
  const nextRoute = chapter?.nextRoute;
  const { playSound } = useSoundEffects();
  const soundPlayedRef = useRef(false);

  useEffect(() => {
    if (soundPlayedRef.current) return;
    soundPlayedRef.current = true;
    playSound("chapterSuspense");
  }, [playSound]);

  useEffect(() => {
    if (!nextRoute) {
      void navigate("/home", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      void navigate(nextRoute, { replace: true });
    }, CHAPTER_SCREEN_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigate, nextRoute]);

  if (!chapter) return null;

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>{chapter.title}</h1>
    </div>
  );
}
