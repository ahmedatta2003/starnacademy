import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initDepth3D } from "./lib/depth3d";

createRoot(document.getElementById("root")!).render(<App />);
initDepth3D();
