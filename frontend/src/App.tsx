import React from "react";
import { AuthProvider } from "./hooks/useAuth";
import { AppContent } from "./components/AppContent";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
