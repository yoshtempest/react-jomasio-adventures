import { createContext, useContext, useEffect, useState, useRef } from "react";

interface PWAContextType {
  canInstall: boolean;
  install: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType>({
  canInstall: false,
  install: async () => {},
});

// Capture beforeinstallprompt at module level (fires before React mounts)
let _deferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    _deferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [canInstall, setCanInstall] = useState(() => _deferredPrompt !== null);
  const deferredPromptRef = useRef(_deferredPrompt);

  useEffect(() => {
    if (deferredPromptRef.current) return;

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install(): Promise<void> {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    deferredPromptRef.current = null;
    setCanInstall(false);
  }

  return (
    <PWAContext.Provider value={{ canInstall, install }}>
      {children}
    </PWAContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePWA() {
  return useContext(PWAContext);
}
