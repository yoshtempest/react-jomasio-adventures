import { useLatestRef } from "@/hooks/useLatestRef";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useLocation,
  useNavigate,
  type NavigateOptions,
  type To,
} from "react-router";

type TransitionContextType = {
  isFading: boolean;
  navigateWithFade: (to: To | number, options?: NavigateOptions) => void;
};

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFading, setIsFading] = useState(false);
  const pendingRef = useRef<{ to: To; options?: NavigateOptions } | null>(null);
  const isFadingRef = useLatestRef(isFading);
  const prevPathRef = useRef(location.pathname + location.search);

  const navigateWithFade = useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        void navigate(to);
        return;
      }
      if (isFadingRef.current) return;
      pendingRef.current = { to, options };
      setIsFading(true);
    },
    [navigate, isFadingRef],
  );

  // After fade-out completes, execute the pending navigation
  useEffect(() => {
    if (!isFading || !pendingRef.current) return;
    const id = setTimeout(() => {
      const p = pendingRef.current;
      pendingRef.current = null;
      void navigate(p!.to, p!.options);
    }, 350);
    return () => clearTimeout(id);
  }, [isFading, navigate]);

  // When location changes (navigation happened), fade back in
  useEffect(() => {
    const path = location.pathname + location.search;
    if (prevPathRef.current === path) return undefined;
    prevPathRef.current = path;
    if (!isFading) return undefined;
    const id = setTimeout(() => setIsFading(false), 80);
    return () => clearTimeout(id);
  }, [location, isFading]);

  return (
    <TransitionContext.Provider value={{ isFading, navigateWithFade }}>
      {children}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999999,
          backgroundColor: "#000",
          transition: "opacity 0.3s ease",
          opacity: isFading ? 1 : 0,
          pointerEvents: isFading ? "auto" : "none",
        }}
      />
    </TransitionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTransitionCtx() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransitionCtx precisa do TransitionProvider");
  return ctx;
}
