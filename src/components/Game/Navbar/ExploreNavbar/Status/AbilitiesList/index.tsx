import { useEffect, useRef, useState } from "react";
import { Zap, ShieldCheck, Clock, Coins, Sparkles } from "lucide-react";

import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";

import { getCharacterAbilities } from "@/data/characters/abilities";
import { getEnergyName } from "@/gameRules/battle/mana";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";
import type { CharacterAbility } from "@/utils/types/player/abilities";

import styles from "./styles.module.css";

function formatCooldown(cooldownMs: number) {
  return `${cooldownMs / 1000}s`;
}

function AbilityMeta({ ability }: { ability: CharacterAbility }) {
  const { player } = usePlayer();
  const energyName = getEnergyName(player.character);

  if (ability.kind === "active") {
    return (
      <>
        {ability.cost !== undefined && (
          <span className={styles.meta}>
            <Coins size={12} /> {ability.cost} de {energyName}
          </span>
        )}
        {ability.cooldownMs !== undefined && (
          <span className={styles.meta}>
            <Clock size={12} /> Cooldown {formatCooldown(ability.cooldownMs)}
          </span>
        )}
        {ability.requires && (
          <span className={styles.meta}>
            <Sparkles size={12} /> {ability.requires}
          </span>
        )}
      </>
    );
  }

  return (
    <>
      <span className={styles.meta}>Nv. {ability.unlockedAtLevel}</span>
      {ability.oncePerBattle && (
        <span className={styles.meta}>1x por batalha</span>
      )}
    </>
  );
}

export function AbilitiesList() {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const character = player.character;
  const level = progress[character]?.level ?? 1;

  const abilities = getCharacterAbilities(character);
  const totalItems = abilities.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current.querySelector<HTMLElement>(
      `[data-index="${selectedIndex}"]`,
    );
    if (!el) return;

    const container = containerRef.current;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const { scrollTop, clientHeight } = container;

    if (elTop < scrollTop) {
      container.scrollTop = elTop;
    } else if (elBottom > scrollTop + clientHeight) {
      container.scrollTop = elBottom - clientHeight;
    }
  }, [selectedIndex]);

  useGameControlsLayer(
    {
      onUp: () => setSelectedIndex((i) => Math.max(0, i - 1)),
      onDown: () => setSelectedIndex((i) => Math.min(totalItems - 1, i + 1)),
    },
    [totalItems],
  );

  return (
    <div className="containerOfNavbar" style={{ overflow: "hidden" }}>
      <h2>Habilidades</h2>
      <div ref={containerRef} className={styles.container}>
        {abilities.length === 0 && (
          <p className={styles.empty}>
            Este personagem ainda não tem habilidades definidas.
          </p>
        )}

        {abilities.map((ability, i) => {
          const active = ability.kind === "active";
          const locked = !active && level < ability.unlockedAtLevel;
          const Icon = active ? Zap : ShieldCheck;

          return (
            <div
              key={ability.id}
              data-index={i}
              className={`${styles.card} ${i === selectedIndex ? styles.selected : ""}`}
              style={locked ? { opacity: 0.5 } : undefined}
            >
              <div className={styles.header}>
                <Icon size={16} color={active ? "#fbbf24" : "#4ade80"} />
                <span className={styles.name}>{ability.name}</span>
                <span
                  className={`${styles.badge} ${
                    active ? styles.badgeActive : styles.badgePassive
                  }`}
                >
                  {active ? "Ativa" : "Passiva"}
                </span>
              </div>

              <p className={styles.description}>{ability.description}</p>

              <div className={styles.metaRow}>
                <AbilityMeta ability={ability} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
