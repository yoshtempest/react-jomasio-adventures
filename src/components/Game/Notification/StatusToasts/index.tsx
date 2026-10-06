import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useToast } from "@/contexts/ToastContext";
import { getCharacterName } from "@/data/options/characters";
import { HUNGRY_THRESHOLD } from "@/data/player/hunger";
import { SLEEPY_THRESHOLD } from "@/data/player/sleep";
import { playerPath } from "@/utils/paths";

/**
 * Notificações de status do personagem em explore/batalha: level up, fome e
 * sono. Só observa o estado já renderizado (diff em effect, mesmo padrão do
 * `XPBarNotification`) — nunca dispara efeito dentro do updater do
 * `setProgress`.
 */
export function StatusToasts() {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const { showToast } = useToast();

  const character = player.character;
  const charProgress = progress[character];

  // Nível/fome/sono anteriores vêm junto do personagem a que pertencem:
  // trocar de personagem troca os três números sem que ele tenha progredido.
  const prevRef = useRef({
    character,
    level: charProgress.level,
    hunger: charProgress.hunger,
    sleep: charProgress.sleep,
  });

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = {
      character,
      level: charProgress.level,
      hunger: charProgress.hunger,
      sleep: charProgress.sleep,
    };

    // Trocar de personagem não é progresso do novo: reancora sem notificar.
    if (prev.character !== character) return;

    const icon = playerPath(`/${character}/face.svg`);
    const iconFallback = playerPath(`/${character}/expressions/default.svg`);
    const name = getCharacterName(character);

    if (charProgress.level > prev.level) {
      showToast({
        icon,
        iconFallback,
        text: `${name} subiu para Nv.${charProgress.level}!`,
      });
    }

    // Aviso ao CRUZAR o limiar para baixo; rearma sozinho quando a barra
    // voltar acima (comer/dormir/level up), sem repetir a cada tick.
    if (
      prev.hunger > HUNGRY_THRESHOLD &&
      charProgress.hunger <= HUNGRY_THRESHOLD
    ) {
      showToast({ icon, iconFallback, text: `${name} está com fome!` });
    }

    if (
      prev.sleep > SLEEPY_THRESHOLD &&
      charProgress.sleep <= SLEEPY_THRESHOLD
    ) {
      showToast({ icon, iconFallback, text: `${name} está com sono!` });
    }
  }, [
    character,
    charProgress.level,
    charProgress.hunger,
    charProgress.sleep,
    showToast,
  ]);

  return null;
}
