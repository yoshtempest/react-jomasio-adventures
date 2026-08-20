import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useServiceWorkerUpdate } from "tempest-react-sdk";

export type UpdateStatus =
  | "idle"
  | "checking"
  | "uptodate"
  | "available"
  | "error";

type UpdateContextType = {
  status: UpdateStatus;
  checkForUpdate: () => void;
  applyUpdate: () => void;
  lastChecked: number | null;
};

const UpdateContext = createContext<UpdateContextType>({
  status: "idle",
  checkForUpdate: () => {},
  applyUpdate: () => {},
  lastChecked: null,
});

/**
 * Registers the service worker and exposes a user-driven update flow.
 *
 * `useServiceWorkerUpdate` keeps `autoUpdate` off, so a freshly installed
 * worker never reloads the page on its own. That is deliberate: the previous
 * `registerType: "autoUpdate"` setup could reload mid-battle and drop the
 * player's run. `status` reaches `"available"` instead, and the UI decides when
 * to call `applyUpdate`.
 *
 * The status is derived rather than stored because the registration itself is
 * the source of truth — the old implementation had to guess with a five second
 * timeout since `registerSW` never reported when a check finished.
 */
export function UpdateProvider({ children }: { children: ReactNode }) {
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);

  const { updateAvailable, applyUpdate, registration } = useServiceWorkerUpdate(
    {
      url: `${import.meta.env.BASE_URL}sw.js`,
      scope: import.meta.env.BASE_URL,
      onError: () => setFailed(true),
    },
  );

  const checkForUpdate = useCallback(() => {
    if (!registration) {
      setFailed(true);
      return;
    }

    setFailed(false);
    setChecking(true);
    setLastChecked(Date.now());

    registration
      .update()
      .catch(() => setFailed(true))
      .finally(() => setChecking(false));
  }, [registration]);

  const status: UpdateStatus = failed
    ? "error"
    : checking
      ? "checking"
      : updateAvailable
        ? "available"
        : registration
          ? "uptodate"
          : "idle";

  return (
    <UpdateContext.Provider
      value={{ status, checkForUpdate, applyUpdate, lastChecked }}
    >
      {children}
    </UpdateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUpdate() {
  return useContext(UpdateContext);
}
