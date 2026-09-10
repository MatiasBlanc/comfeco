import { StrictMode, type JSX } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import PulsePage from "./pages/PulsePage";
import SurveyPage from "./pages/SurveyPage";
import "./styles.css";

function Root(): JSX.Element {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/survey") {
    return <SurveyPage />;
  }

  if (path === "/pulse") {
    return <PulsePage />;
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
