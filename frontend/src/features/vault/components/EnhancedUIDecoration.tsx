import React from "react";

export const EnhancedUIDecoration: React.FC = () => (
  <>
    <div
      className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.01] rounded-full blur-2xl pointer-events-none"
      aria-hidden="true"
    />
    <div
      className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"
      aria-hidden="true"
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/[0.005] rounded-full blur-3xl pointer-events-none"
      aria-hidden="true"
    />
    <div
      className="hidden lg:block absolute left-4 top-4 w-1 h-1 bg-white/10 rounded-full"
      aria-hidden="true"
    />
    <div
      className="hidden lg:block absolute right-4 bottom-4 w-1.5 h-1.5 bg-emerald-500/10 rounded-full"
      aria-hidden="true"
    />
  </>
);
