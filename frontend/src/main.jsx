import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login";
import KnowledgeBase from "./pages/KnowledgeBase";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import CustomerPortal from "./pages/CustomerPortal";
import ServiceDeskPortal from "./pages/ServiceDeskPortal";
import EngineerPortal from "./pages/EngineerPortal";
import Admin from "./Admin";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
  path="/admin/knowledge"
  element={<KnowledgeBase />}
/>

        <Route
          path="/customer"
          element={<CustomerPortal />}
        />

        <Route
          path="/service-desk"
          element={<ServiceDeskPortal />}
        />

        <Route
          path="/engineer"
          element={<EngineerPortal />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);