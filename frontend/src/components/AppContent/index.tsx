import React from "react";
import { useAuth } from "../../hooks/useAuth";
import SaasDashboard from "../SaaSDashboard";
import { LoadingScreen } from "./LoadingScreen";
import { AuthScreen } from "./AuthScreen";

export function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <SaasDashboard />;
}

export default AppContent;
