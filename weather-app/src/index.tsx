import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theming/theme";
import "@mantine/core/styles.css";
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </HashRouter>
  </React.StrictMode>
);
