import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorIcon } from "./VaultErrorBoundary/ErrorIcon";
import { ErrorStack } from "./VaultErrorBoundary/ErrorStack";
import { ReloadButton } from "./VaultErrorBoundary/ReloadButton";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class VaultErrorBoundary extends Component<Props, State> {
  declare props: Props;
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("VaultErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto bg-[#0a0a0a]/90 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 space-y-6 shadow-2xl relative my-12 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
          <div className="flex flex-col items-center gap-3">
            <ErrorIcon />
            <h2 className="text-xl font-display font-semibold text-white tracking-tight">Krytyczny błąd szyfrowania / Sejfu</h2>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed font-sans">
              Wystąpił nieoczekiwany błąd podczas odszyfrowywania pamięci RAM lub renderowania interfejsu.
              Może to oznaczać niepoprawny stan KEK lub uszkodzony pakiet AES-GCM.
            </p>
          </div>

          {this.state.error && <ErrorStack error={this.state.error} />}

          <ReloadButton onReload={this.handleReload} />
        </div>
      );
    }

    return this.props.children;
  }
}
export default VaultErrorBoundary;
