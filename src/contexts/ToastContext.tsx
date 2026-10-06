import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Notificação flutuante de recompensa: ícone à esquerda e texto centralizado.
 * `iconFallback` é a segunda tentativa de `src` quando o asset principal não
 * existe (rosto de personagem sem `face.svg`, por exemplo).
 */
export type ToastRequest = {
  icon: string;
  iconFallback?: string;
  text: string;
  /** Milissegundos antes do auto-dismiss. Padrão: {@link DEFAULT_TOAST_DURATION}. */
  duration?: number;
};

export type Toast = ToastRequest & { id: number };

/**
 * 4000ms — dentro da janela de 3–5s pedida para as notificações de recompensa,
 * e igual ao default do toast de referência que este sistema substitui.
 */
const DEFAULT_TOAST_DURATION = 4000;

/**
 * Teto da pilha visível: uma coleta com vários drops não pode cobrir a tela.
 * O mais antigo sai da lista; o timer dele continua até fire-and-forget
 * (dismiss de id já removido é no-op) e morre no cleanup do unmount.
 */
const MAX_VISIBLE_TOASTS = 3;

type ToastActionsContextType = {
  showToast: (request: ToastRequest) => void;
};

type ToastQueueContextType = {
  toasts: Toast[];
  dismissToast: (id: number) => void;
};

/**
 * Dois contextos de propósito: quem dispara (`showToast`) consome só as
 * ações, de identidade estável — mudanças na fila não re-renderizam
 * TitleContext/InventoryContext inteiros. Quem renderiza consome a fila.
 */
const ToastActionsContext = createContext<ToastActionsContextType | null>(null);
const ToastQueueContext = createContext<ToastQueueContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(0);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  // Regra 2: nenhum timer de toast sobrevive ao unmount do provider.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timeout of timers.values()) clearTimeout(timeout);
      timers.clear();
    };
  }, []);

  const dismissToast = useCallback((id: number) => {
    const timeout = timersRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (request: ToastRequest) => {
      const id = ++nextIdRef.current;
      const timeout = setTimeout(
        () => dismissToast(id),
        request.duration ?? DEFAULT_TOAST_DURATION,
      );
      timersRef.current.set(id, timeout);
      setToasts((prev) =>
        [...prev, { ...request, id }].slice(-MAX_VISIBLE_TOASTS),
      );
    },
    [dismissToast],
  );

  const actions = useMemo(() => ({ showToast }), [showToast]);
  const queue = useMemo(
    () => ({ toasts, dismissToast }),
    [toasts, dismissToast],
  );

  return (
    <ToastActionsContext.Provider value={actions}>
      <ToastQueueContext.Provider value={queue}>
        {children}
      </ToastQueueContext.Provider>
    </ToastActionsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastActionsContext);
  if (!ctx) throw new Error("useToast precisa do ToastProvider");
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToastQueue() {
  const ctx = useContext(ToastQueueContext);
  if (!ctx) throw new Error("useToastQueue precisa do ToastProvider");
  return ctx;
}
