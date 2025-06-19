import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";
import { SocketProvider } from "./context/socket.tsx";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";

import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";

const theme = createTheme({
  fontFamily:
    "Plus Jakarta Sans, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
