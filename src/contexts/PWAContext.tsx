import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  requestPersistentStorage,
  useInstallPrompt,
  type InstallMethod,
} from "tempest-react-sdk";

type PWAContextType = {
  canInstall: boolean;
  isInstalled: boolean;
  method: InstallMethod;
  isIOS: boolean;
  isManualAndroid: boolean;
  openInChromeIntent: string | null;
  install: () => Promise<boolean>;
  recordDecline: () => void;
  showInstalledMessage: boolean;
  setShowInstalledMessage: (show: boolean) => void;
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
};

const PWAContext = createContext<PWAContextType | null>(null);

const PERSIST_REQUESTED_KEY = "jomasio_storage_persist_requested";

/**
 * Exposes the PWA install flow and asks the browser to make this origin's
 * storage durable.
 *
 * Install resolution comes from `useInstallPrompt`, which reports a `method`
 * instead of a single boolean. That distinction matters here: the previous
 * implementation only understood Chromium's `beforeinstallprompt`, so every
 * iOS visitor fell through to a popup describing the Android browser menu.
 *
 * The whole save lives in `localStorage` plus the Cache Storage, both of which
 * a browser may evict under disk pressure with no warning and no recovery.
 * `requestPersistentStorage()` opts the origin out of that. It is fired once
 * and the attempt is recorded, because the browser decides by engagement
 * heuristics and re-asking on every mount neither helps nor is free.
 */
export function PWAProvider({ children }: { children: ReactNode }) {
  const {
    canInstall,
    isStandalone,
    method,
    isIOS,
    isManualAndroid,
    openInChromeIntent,
    install,
    recordDecline,
  } = useInstallPrompt({
    declineStorageKey: "jomasio_install_declined_at",
  });

  const [showInstalledMessage, setShowInstalledMessage] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(PERSIST_REQUESTED_KEY)) return;
    localStorage.setItem(PERSIST_REQUESTED_KEY, "1");
    void requestPersistentStorage();
  }, []);

  return (
    <PWAContext.Provider
      value={{
        canInstall,
        isInstalled: isStandalone,
        method,
        isIOS,
        isManualAndroid,
        openInChromeIntent,
        install,
        recordDecline,
        showInstalledMessage,
        setShowInstalledMessage,
        showInstructions,
        setShowInstructions,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePWA() {
  const ctx = useContext(PWAContext);
  if (!ctx) throw new Error("usePWA precisa do PWAProvider");
  return ctx;
}
