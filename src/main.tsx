import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { SpeedInsights } from '@vercel/speed-insights/next';


import App from "./App.tsx";
import Overview from "./pages/Overview.tsx";
import Login from "./pages/Login.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

import "./index.css";

import { DialogProvider } from "./context/DialogContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <DialogProvider>
      <BrowserRouter>
        <SpeedInsights />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </BrowserRouter>
    </DialogProvider>
  </AuthProvider>
);
