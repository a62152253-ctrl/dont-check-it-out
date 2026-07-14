import React from "react";
import { Cloud, Database, Key, Terminal, Server, Globe, Mail, FileText, Shield } from "lucide-react";

export function getCategoryIcon(cat: string) {
  switch (cat) {
    case "AWS":
    case "AWS Credentials":
      return <Cloud className="w-3.5 h-3.5" />;
    case "Database":
    case "Database Credentials":
      return <Database className="w-3.5 h-3.5" />;
    case "API Keys":
    case "API Key / Token":
      return <Key className="w-3.5 h-3.5" />;
    case "SSH Keys":
    case "SSH Key":
      return <Terminal className="w-3.5 h-3.5" />;
    case "Servers":
    case "Server / VPS":
      return <Server className="w-3.5 h-3.5" />;
    case "Websites":
    case "Web Login":
      return <Globe className="w-3.5 h-3.5" />;
    case "Emails":
    case "Email Config":
      return <Mail className="w-3.5 h-3.5" />;
    case "Notes":
    case "Secure Note":
      return <FileText className="w-3.5 h-3.5" />;
    default:
      return <Shield className="w-3.5 h-3.5" />;
  }
}
