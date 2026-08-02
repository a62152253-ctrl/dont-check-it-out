import React, { createContext, useContext, ReactNode } from "react";
import type { UseVaultReturn } from "../hooks/useVault";

const VaultContext = createContext<UseVaultReturn | undefined>(undefined);

export function VaultProvider({ 
  value, 
  children 
}: { 
  value: UseVaultReturn; 
  children: ReactNode;
}) {
  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  );
}

export function useVaultContext(): UseVaultReturn {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error("useVaultContext must be used within a VaultProvider");
  }
  return context;
}
