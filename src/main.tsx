// import "tempest-react-sdk/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import "./styles/index.css";

import { AppProviders } from "@/contexts/AppProviders";
import { AppRoutes } from "@/pages/AppRoutes";

type ContainerWithRoot = HTMLElement & {
  _reactRoot: ReturnType<typeof createRoot>;
};

const container = document.getElementById("root")!;
const root =
  (container as ContainerWithRoot)._reactRoot ||
  ((container as ContainerWithRoot)._reactRoot = createRoot(container));

root.render(
  <StrictMode>
    <HashRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </HashRouter>
  </StrictMode>,
);
