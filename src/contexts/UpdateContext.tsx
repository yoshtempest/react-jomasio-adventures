import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { registerSW } from "virtual:pwa-register";

export type UpdateStatus = "idle" | "checking" | "uptodate" | "error";

type UpdateContextType = {
  status: UpdateStatus;
  checkForUpdate: () => void;
  lastChecked: number | null;
};

const UpdateContext = createContext<UpdateContextType>({
  status: "idle",
  checkForUpdate: () => {},
  lastChecked: null,
});

export function UpdateProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const updateFnRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(
    null,
  );

  useEffect(() => {
    const updateFn = registerSW({
      immediate: true,
      onOfflineReady() {
        setStatus("uptodate");
      },
      onRegistered() {
        setStatus("uptodate");
      },
      onRegisterError() {
        setStatus("error");
      },
    });
    updateFnRef.current = updateFn;
  }, []);

  const checkForUpdate = useCallback(() => {
    setStatus("checking");
    setLastChecked(Date.now());

    if (updateFnRef.current) {
      updateFnRef
        .current()
        .then(() => setStatus("uptodate"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }

    setTimeout(() => {
      setStatus((prev) => (prev === "checking" ? "uptodate" : prev));
    }, 5000);
  }, []);

  return (
    <UpdateContext.Provider value={{ status, checkForUpdate, lastChecked }}>
      {children}
    </UpdateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUpdate() {
  return useContext(UpdateContext);
}
