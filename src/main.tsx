import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";


import App from "./App.tsx";
import Overview from "./pages/Overview.tsx";
import Login from "./pages/Login.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

import "./index.css";

import { DialogProvider } from "./context/DialogContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <DialogProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </BrowserRouter>
    </DialogProvider>
  </AuthProvider>
);
