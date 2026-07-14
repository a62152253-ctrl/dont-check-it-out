export interface ParsedDotenvItem {
  key: string;
  val: string;
  category: string;
  checked: boolean;
}

export function parseDotenvContent(dotenvContent: string): ParsedDotenvItem[] {
  if (!dotenvContent.trim()) return [];
  const lines = dotenvContent.split("\n");
  const list: ParsedDotenvItem[] = [];

  lines.forEach(line => {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith("#")) return;
    const firstEquals = cleanLine.indexOf("=");
    if (firstEquals === -1) return;
    const rawKey = cleanLine.substring(0, firstEquals).trim();
    let rawVal = cleanLine.substring(firstEquals + 1).trim();

    // Strip surrounding quotes
    if (
      (rawVal.startsWith('"') && rawVal.endsWith('"')) || 
      (rawVal.startsWith("'") && rawVal.endsWith("'"))
    ) {
      rawVal = rawVal.substring(1, rawVal.length - 1);
    }

    if (rawKey) {
      let probableCategory = "API Keys";
      if (rawKey.includes("DATABASE") || rawKey.includes("DB_")) {
        probableCategory = "Database";
      } else if (rawKey.includes("AWS") || rawKey.includes("S3_")) {
        probableCategory = "AWS";
      } else if (rawKey.includes("SSH_") || rawKey.includes("PRIVATE_KEY")) {
        probableCategory = "SSH Keys";
      }
      
      list.push({
        key: rawKey,
        val: rawVal,
        category: probableCategory,
        checked: true
      });
    }
  });

  return list;
}
