import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { DataProvider } from "./context/DataContext";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Import tempo routes separately to avoid circular dependency
let TempoRoutes = () => null;
if (import.meta.env.VITE_TEMPO === "true") {
  // Dynamically import routes
  import("tempo-routes")
    .then((module) => {
      const routes = module.default;
      TempoRoutes = () => useRoutes(routes);
    })
    .catch((err) => console.error("Failed to load tempo routes:", err));
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <DataProvider>
        <App />
        {import.meta.env.VITE_TEMPO === "true" && <TempoRoutes />}
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
