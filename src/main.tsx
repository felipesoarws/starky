import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import App from "./App.tsx";
import Overview from "./pages/Overview.tsx";
import Login from "./pages/Login.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/overview" element={<Overview />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
