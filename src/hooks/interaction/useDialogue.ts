import { useState, useCallback, useMemo, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { characterSprites } from "@/data/characters/sprites";
import { playerPath } from "@/utils/paths";

export function useDialogue(dialogues: Dialogue[], onFinish?: () => void) {
  const { player } = usePlayer();

  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [customDialogues, setCustomDialogues] = useState<Dialogue[] | null>(
    null,
  );
  const customDialoguesRef = useLatestRef(customDialogues);
  const customOnFinishRef = useRef<(() => void) | null>(null);
  /**
   * Índice da linha cujo `onConfirm` já foi consumido. O callback precisa rodar
   * uma única vez por linha: quando ele segura o avanço, quem retoma a
   * conversa é a própria animação (chamando `next()` ao terminar) e não deve
   * disparar o efeito de novo.
   */
  const consumedConfirmRef = useRef(-1);

  const activeDialogues = customDialogues ?? dialogues;

  // 🔥 AQUI É A MÁGICA
  const processedDialogues = useMemo(() => {
    const storedName = localStorage.getItem("playerName") || "Protagonista";

    return activeDialogues.map((line) => {
      if (line.isPlayer) {
        const src = line.expression
          ? playerPath(
              `/${player.character}/expressions/${line.expression}.svg`,
            )
          : characterSprites[player.character];
        return {
          ...line,
          name: storedName,
          src,
        };
      }

      return line;
    });
  }, [activeDialogues, player.character]);

  const start = useCallback(
    (newDialogues?: Dialogue[], newOnFinish?: () => void) => {
      if (newDialogues) {
        setCustomDialogues(newDialogues);
        customOnFinishRef.current = newOnFinish ?? null;
      }
      consumedConfirmRef.current = -1;
      setIndex(0);
      setIsOpen(true);
    },
    [],
  );

  /**
   * Encerra o diálogo e dispara o callback de término correspondente — o do
   * sub-diálogo quando há um em curso, senão o `onFinish` do diálogo raiz.
   */
  const finish = useCallback(() => {
    setIsOpen(false);
    const wasSubDialogue = customDialoguesRef.current !== null;
    const customOnFinish = customOnFinishRef.current;
    setCustomDialogues(null);
    customOnFinishRef.current = null;
    if (wasSubDialogue) {
      customOnFinish?.();
    } else {
      onFinish?.();
    }
  }, [onFinish, customDialoguesRef]);

  /**
   * Avança a conversa. Antes de mudar de linha, dá chance da linha atual
   * confirmar: um `onConfirm` que devolve `false` segura o avanço e devolve o
   * controle para quem disparou o efeito.
   */
  const next = useCallback(() => {
    const line = processedDialogues[index];

    if (line?.onConfirm && consumedConfirmRef.current !== index) {
      consumedConfirmRef.current = index;
      if (line.onConfirm() === false) return;
    }

    if (index >= processedDialogues.length - 1) {
      finish();
      return;
    }
    setIndex((prev) => prev + 1);
  }, [index, processedDialogues, finish]);

  /** Corta o diálogo restante e vai direto para o término. */
  const skip = useCallback(() => {
    setIndex(0);
    finish();
  }, [finish]);

  const dialogue = useMemo(() => {
    return processedDialogues[index];
  }, [processedDialogues, index]);

  const nextSoundSrc = useMemo(() => {
    if (!isOpen) return processedDialogues[0]?.soundSrc;
    const nextIdx = index + 1;
    if (nextIdx >= processedDialogues.length) return undefined;
    return processedDialogues[nextIdx]?.soundSrc;
  }, [isOpen, index, processedDialogues]);

  const isLast = index === processedDialogues.length - 1;

  return useMemo(
    () => ({
      dialogue,
      isOpen,
      start,
      next,
      skip,
      isLast,
      index,
      length: processedDialogues.length,
      nextSoundSrc,
    }),
    [
      dialogue,
      isOpen,
      start,
      next,
      skip,
      isLast,
      index,
      processedDialogues.length,
      nextSoundSrc,
    ],
  );
}
