import React from "react";
import AuthForms from "../AuthForms";

export function AuthScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#080808] overflow-x-hidden">
      <AuthForms />
    </div>
  );
}
