import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";
import { DialogProvider } from "./context/DialogContext.tsx";

// Lazy load pages
const Overview = lazy(() => import("./pages/Overview.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.tsx"));

// Loading component
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white">
    <Loader2 className="w-8 h-8 animate-spin text-accent" />
  </div>
);

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AuthProvider>
      <DialogProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </DialogProvider>
    </AuthProvider>
  </HelmetProvider>
);
