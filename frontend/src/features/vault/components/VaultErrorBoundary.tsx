import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

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
    console.error("Uncaught error in Vault:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-[#0c0c0c]/90 border border-white/5 rounded-2xl">
          <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
          <h2 className="text-xl font-display font-bold text-white mb-2 tracking-tight">Krytyczny błąd interfejsu</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6 text-xs leading-relaxed">
            Wystąpił nieoczekiwany problem z renderowaniem komponentu. Odśwież aplikację, aby spróbować ponownie.
          </p>

          {this.state.error && (
            <div className="bg-[#121212] border border-white/5 rounded-lg p-3 text-left w-full max-w-lg mb-6 overflow-auto">
              <span className="block text-[9px] font-mono text-rose-500/70 uppercase mb-1">Szczegóły błędu</span>
              <pre className="text-[10px] font-mono text-slate-300 break-words whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
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
