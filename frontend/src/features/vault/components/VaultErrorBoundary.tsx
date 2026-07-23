import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface VaultErrorBoundaryProps {
  children: ReactNode;
}

interface VaultErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class VaultErrorBoundary extends Component<VaultErrorBoundaryProps, VaultErrorBoundaryState> {
  constructor(props: VaultErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): VaultErrorBoundaryState {
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
        <div className="max-w-xl mx-auto bg-[#0a0a0a]/90 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-10 space-y-6 shadow-2xl relative my-12 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-white tracking-tight mt-2">Krytyczny błąd szyfrowania / Sejfu</h2>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-sans">
              Wystąpił nieoczekiwany błąd podczas odszyfrowywania pamięci RAM lub renderowania interfejsu.
              Może to oznaczać niepoprawny stan KEK lub uszkodzony pakiet AES-GCM.
            </p>
          </div>

          {this.state.error && (
            <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-left font-mono text-[10px] text-rose-300 max-h-[150px] overflow-y-auto break-all">
              {this.state.error.stack || this.state.error.message}
            </div>
          )}

          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-500/10 cursor-pointer mx-auto hover:scale-[1.01] active:scale-[0.99]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Odśwież aplikację</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default VaultErrorBoundary;
