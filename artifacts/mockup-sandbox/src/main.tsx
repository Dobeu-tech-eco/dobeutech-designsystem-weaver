import { createRoot } from "react-dom/client";
import * as amplitude from "@amplitude/unified";
import App from "./App";
import "./index.css";

amplitude.initAll("7592b9266570a49b68a07e8d3b027915", {
  analytics: { autocapture: true },
  sessionReplay: { sampleRate: 1 },
});

createRoot(document.getElementById("root")!).render(<App />);
