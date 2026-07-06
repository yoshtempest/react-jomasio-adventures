import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Droplets } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";

export function Bleeding() {
    const { player } = usePlayer();
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        const update = () => setRemaining(Math.max(0, player.bleedUntil - Date.now()));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [player.bleedUntil]);

    if (remaining <= 0) return null;

    const seconds = Math.ceil(remaining / 1000);

    return (
        <div className={styles.container}>
            <Droplets fill="red" color="red" size={24} />
            <span>{seconds}s</span>
        </div>
    );
}
