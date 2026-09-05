// import "tempest-react-sdk/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import "./styles/index.css";

import { AppProviders } from "@/contexts/AppProviders";
import { AppRoutes } from "@/pages/AppRoutes";
import { applyGameViewportWidth } from "@/data/grid";

type ContainerWithRoot = HTMLElement & {
  _reactRoot: ReturnType<typeof createRoot>;
};

applyGameViewportWidth(document.documentElement);

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
