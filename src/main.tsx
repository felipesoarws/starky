import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Overview from "./pages/Overview.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/overview" element={<Overview />} />
      {/*  <Route path="/account" element={<App />} /> */}
    </Routes>
  </BrowserRouter>
);
