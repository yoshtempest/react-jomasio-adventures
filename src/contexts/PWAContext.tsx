import { createContext, useContext, useEffect, useState, useRef } from "react";

interface PWAContextType {
  canInstall: boolean;
  isInstalled: boolean;
  showInstalledMessage: boolean;
  setShowInstalledMessage: (show: boolean) => void;
  showNotAvailableMessage: boolean;
  setShowNotAvailableMessage: (show: boolean) => void;
  install: () => Promise<void>;
}

function detectInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as Record<string, unknown>).standalone === true
  );
}

const PWAContext = createContext<PWAContextType>({
  canInstall: false,
  isInstalled: false,
  showInstalledMessage: false,
  setShowInstalledMessage: () => {},
  showNotAvailableMessage: false,
  setShowNotAvailableMessage: () => {},
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
  const [isInstalled, setIsInstalled] = useState(detectInstalled);
  const [showInstalledMessage, setShowInstalledMessage] = useState(false);
  const [showNotAvailableMessage, setShowNotAvailableMessage] = useState(false);
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

  useEffect(() => {
    const onInstalled = () => setIsInstalled(true);
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
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
    <PWAContext.Provider
      value={{
        canInstall,
        isInstalled,
        showInstalledMessage,
        setShowInstalledMessage,
        showNotAvailableMessage,
        setShowNotAvailableMessage,
        install,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePWA() {
  return useContext(PWAContext);
}
