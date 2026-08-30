import React from "react";
import { DecryptedSecret } from "../../types";
import { mapLegacyCategory } from "../../hooks/useVault";
import { InspectorHeader } from "./InspectorHeader";
import { LegacyWarning } from "./LegacyWarning";
import { AwsCategory } from "./AwsCategory";
import { DbCategory } from "./DbCategory";
import { SshCategory } from "./SshCategory";
import { DotenvCategory } from "./DotenvCategory";
import { StandardCategory } from "./StandardCategory";
import { SecureNotes } from "./SecureNotes";
import { AuditLog } from "./AuditLog";
import { ActionButtons } from "./ActionButtons";

export function InspectorContent({ secret }: { secret: DecryptedSecret }) {
  const standardizedCategory = mapLegacyCategory(secret.category);

  return (
    <div className="space-y-3.5">
      <InspectorHeader secret={secret} />
      <LegacyWarning secret={secret} />

      {standardizedCategory === "AWS" && <AwsCategory secret={secret} />}
      {standardizedCategory === "Database" && <DbCategory secret={secret} />}
      {standardizedCategory === "SSH Keys" && <SshCategory secret={secret} />}
      {standardizedCategory === "API Keys" && <DotenvCategory secret={secret} />}
      {["Websites", "Emails", "Notes", "Servers"].includes(standardizedCategory) && <StandardCategory secret={secret} />}

      <SecureNotes secret={secret} />
      <AuditLog secret={secret} />
      <ActionButtons secret={secret} />
    </div>
  );
}
